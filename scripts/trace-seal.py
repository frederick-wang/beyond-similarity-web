#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
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
TRACE = {"turdsize": 2 * SCALE * SCALE, "alphamax": 1.2, "opttolerance": 0.4}


def rgba(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGBA"))


def median_colour(pixels: np.ndarray) -> str:
    if len(pixels) < 1000:
        raise ValueError(f"only {len(pixels)} pixels to measure a colour from")
    return "#" + "".join(f"{int(np.median(pixels[:, channel])):02x}" for channel in range(3))


def colours(image: np.ndarray) -> tuple[str, str]:
    """The stamp's vermilion and the scroll's white, from fully opaque pixels."""
    opaque = image[image[..., 3] >= 250]
    # Vermilion has a green channel near 56 (light) or 123 (dark); the scroll's is above 250.
    return median_colour(opaque[opaque[:, 1] < 160]), median_colour(opaque[opaque[:, 1] > 200])


def masks(image: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """The silhouette and the scroll as boolean masks at SCALE times the source size."""
    height, width = image.shape[:2]
    upsampled = Image.fromarray(image).resize((width * SCALE, height * SCALE), Image.LANCZOS)
    bands = [band.filter(ImageFilter.GaussianBlur(BLUR * SCALE)) for band in upsampled.split()]
    alpha = np.asarray(bands[3]) / 255
    green = np.asarray(bands[1]) / 255
    silhouette = alpha >= 0.5
    # Vermilion green is about 0.22 and the scroll's about 0.99; 0.61 is the midpoint.
    return silhouette, silhouette & (green >= 0.61)


def number(value: float) -> str:
    text = f"{value / SCALE:.1f}".rstrip("0").rstrip(".")
    return "0" if text == "-0" else text


def path_data(mask: np.ndarray) -> str:
    # potracer reads dark pixels as foreground and inverts its input, so it gets the complement.
    traced = potrace.Bitmap(~mask).trace(turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, opticurve=True, **TRACE)
    commands = []
    for curve in traced:
        commands.append(f"M{number(curve.start_point.x)} {number(curve.start_point.y)}")
        for segment in curve:
            if segment.is_corner:
                corner, end = segment.c, segment.end_point
                commands.append(f"L{number(corner.x)} {number(corner.y)}L{number(end.x)} {number(end.y)}")
            else:
                c1, c2, end = segment.c1, segment.c2, segment.end_point
                commands.append(
                    f"C{number(c1.x)} {number(c1.y)} {number(c2.x)} {number(c2.y)} {number(end.x)} {number(end.y)}"
                )
        commands.append("Z")
    return "".join(commands)


def view_box(image: np.ndarray) -> str:
    rows, columns = np.nonzero(image[..., 3] >= 128)
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
