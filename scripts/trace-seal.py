#!/usr/bin/env -S uv run --script
# /// script
# requires-python = "==3.12.*"
# dependencies = ["potracer==0.0.4", "pillow==13.0.0", "numpy==2.5.4"]
# ///
"""Traces the scroll seal into the SVG favicon, public/favicon.svg.

The seal is raster artwork in two colourings with one shape: src/assets/seal.png
for the light theme and seal-dark.png for the dark theme. The SVG draws the
shape in two layers, the stamp silhouette in vermilion and the white
handscroll with its strokes cut out. Under prefers-color-scheme: dark the
vermilion takes the dark-theme colour, as the seal on the page does. Both
colours, and the scroll's white, are measured from the PNGs.

Tracing uses potracer, a pure-Python port of potrace. The seal is upsampled 4x
with Lanczos and blurred by 0.8 source pixels before thresholding, so potrace
follows the drawn edge instead of the pixel staircase; at that radius the blur
removes tracing wobble along the strokes without rounding them away.

The view box is the smallest square around the seal, centred on it.
scripts/make-site-images.ts crops the PNG favicons to the same box, so every
icon frames the seal alike.

Usage: uv run scripts/trace-seal.py

uv installs the exact packages pinned in scripts/trace-seal.py.lock; after
changing the dependencies above, refresh it with
`uv lock --script scripts/trace-seal.py`.
"""

from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
LIGHT = ROOT / "src/assets/seal.png"
DARK = ROOT / "src/assets/seal-dark.png"
OUTPUT = ROOT / "public/favicon.svg"

SCALE = 4
BLUR = 0.8

# Levels as fractions of full intensity, so the same boundary reads alike in
# the source's 0-255 pixels and in the blurred bands.
# A pixel at least half opaque belongs to the stamp: the view box and the
# silhouette share this edge.
EDGE_ALPHA = 0.5
# Colours are measured on pixels this opaque, so anti-aliased edges do not
# tint the medians.
MEASURED_ALPHA = 250 / 255
# The green channel tells the stamp from the scroll. Vermilion sits near 0.22
# (light theme) or 0.48 (dark theme), the scroll's white near 1; 0.61, the
# midpoint of the light theme's two colours, splits both seals.
SCROLL_GREEN = 0.61

# potrace parameters: speckles up to two source pixels in area are dropped;
# the corner threshold and the curve tolerance were chosen by comparing
# traces with the PNG at 16 to 512 px.
TURDSIZE = 2 * SCALE * SCALE
ALPHAMAX = 1.2
OPTTOLERANCE = 0.4


def rgba(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGBA"))


def median_colour(pixels: np.ndarray) -> str:
    if len(pixels) < 1000:
        raise ValueError(f"only {len(pixels)} pixels to measure a colour from")
    return "#" + "".join(f"{int(np.median(pixels[:, channel])):02x}" for channel in range(3))


def colours(image: np.ndarray) -> tuple[str, str]:
    """The stamp's vermilion and the scroll's white."""
    opaque = image[image[..., 3] / 255 >= MEASURED_ALPHA]
    scroll = opaque[:, 1] / 255 >= SCROLL_GREEN
    return median_colour(opaque[~scroll]), median_colour(opaque[scroll])


def masks(image: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """The silhouette and the scroll as boolean masks at SCALE times the source size."""
    height, width = image.shape[:2]
    upsampled = Image.fromarray(image).resize((width * SCALE, height * SCALE), Image.LANCZOS)
    bands = [band.filter(ImageFilter.GaussianBlur(BLUR * SCALE)) for band in upsampled.split()]
    alpha = np.asarray(bands[3]) / 255
    green = np.asarray(bands[1]) / 255
    silhouette = alpha >= EDGE_ALPHA
    return silhouette, silhouette & (green >= SCROLL_GREEN)


def source_coordinate(value: float) -> str:
    """A traced coordinate scaled back to source pixels, with one decimal and no trailing zero."""
    text = f"{value / SCALE:.1f}".rstrip("0").rstrip(".")
    return "0" if text == "-0" else text


def path_data(mask: np.ndarray) -> str:
    # potracer reads dark pixels as foreground and inverts its input, so it gets the complement.
    traced = potrace.Bitmap(~mask).trace(
        turdsize=TURDSIZE,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=ALPHAMAX,
        opticurve=True,
        opttolerance=OPTTOLERANCE,
    )
    commands = []
    for curve in traced:
        commands.append(f"M{source_coordinate(curve.start_point.x)} {source_coordinate(curve.start_point.y)}")
        for segment in curve:
            if segment.is_corner:
                corner, end = segment.c, segment.end_point
                commands.append(
                    f"L{source_coordinate(corner.x)} {source_coordinate(corner.y)}"
                    f"L{source_coordinate(end.x)} {source_coordinate(end.y)}"
                )
            else:
                c1, c2, end = segment.c1, segment.c2, segment.end_point
                commands.append(
                    f"C{source_coordinate(c1.x)} {source_coordinate(c1.y)}"
                    f" {source_coordinate(c2.x)} {source_coordinate(c2.y)}"
                    f" {source_coordinate(end.x)} {source_coordinate(end.y)}"
                )
        commands.append("Z")
    return "".join(commands)


def view_box(image: np.ndarray) -> str:
    rows, columns = np.nonzero(image[..., 3] / 255 >= EDGE_ALPHA)
    left, right, top, bottom = columns.min(), columns.max() + 1, rows.min(), rows.max() + 1
    side = max(right - left, bottom - top)
    x = round((left + right - side) / 2)
    y = round((top + bottom - side) / 2)
    return f"{x} {y} {side} {side}"


light, dark = rgba(LIGHT), rgba(DARK)
if light.shape != dark.shape or not np.array_equal(light[..., 3], dark[..., 3]):
    raise ValueError("seal.png and seal-dark.png must share one shape: one trace serves both")
vermilion, scroll_white = colours(light)
vermilion_dark, _ = colours(dark)
silhouette, scroll = masks(light)

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box(light)}">
<!-- The scroll seal, traced from src/assets/seal.png by scripts/trace-seal.py; colours from seal.png and seal-dark.png. -->
<style>.seal{{fill:{vermilion}}}@media (prefers-color-scheme:dark){{.seal{{fill:{vermilion_dark}}}}}</style>
<path class="seal" d="{path_data(silhouette)}"/>
<path fill="{scroll_white}" fill-rule="evenodd" d="{path_data(scroll)}"/>
</svg>
"""
OUTPUT.parent.mkdir(exist_ok=True)
OUTPUT.write_text(svg)
print(f"wrote {OUTPUT.relative_to(ROOT)} ({len(svg)} bytes)")
