---
name: Beyond Similarity
description: The paper page in the Explorer's collation world, ink on white paper with indigo annotation and vermilion marks, in English and Chinese.
colors:
  indigo: "#1c50a7"
  indigo-wash: "#e7edf7"
  vermilion: "#b2392b"
  on-vermilion: "#ffffff"
  ink: "#13161c"
  ink-muted: "#525862"
  paper: "#ffffff"
  wash: "#f0f3f7"
  rule: "#dfe2e7"
  plate: "#ffffff"
  indigo-dark: "#78a5ef"
  indigo-wash-dark: "#222935"
  vermilion-dark: "#e87a65"
  on-vermilion-dark: "#0b0e14"
  ink-dark: "#e5e8ed"
  ink-muted-dark: "#9ca2ab"
  paper-dark: "#0b0e14"
  wash-dark: "#13171f"
  rule-dark: "#292e36"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 1.9vw, 2.3rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.4375rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  subtitle:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.25
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  glance-number:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1, 'lnum' 1"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.25
  control:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 550
  small:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  table:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum' 1, 'lnum' 1"
  source:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  classical:
    fontFamily: "'Songti SC', 'Songti TC', 'Noto Serif CJK SC', 'Noto Serif CJK TC', 'Source Han Serif SC', 'SimSun', serif"
  code:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  focus: "2px"
  numeral-nav: "3px"
  numeral: "4px"
  control: "6px"
  frame: "8px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  column: "45rem"
  column-gap: "5rem"
  margin-column: "17.5rem"
  measure: "34em"
  measure-zh: "37em"
  caption-gap: "0.75rem"
  paragraph: "0.9rem"
  block: "2rem"
  subsection: "2.25rem"
  section: "3.5rem"
  footer: "5rem"
components:
  question-numeral:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.on-vermilion}"
    rounded: "{rounded.numeral}"
    size: "1.6rem"
  question-numeral-nav:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.on-vermilion}"
    rounded: "{rounded.numeral-nav}"
    size: "1.25rem"
  lead-sentence:
    textColor: "{colors.ink}"
    typography: "{typography.lead}"
    width: "{spacing.measure}"
  link-row-item:
    textColor: "{colors.indigo}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 0.85rem"
    height: "2.25rem"
  link-row-item-hover:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.indigo}"
  copy-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.indigo}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 0.95rem"
    height: "2.25rem"
  copy-button-hover:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.indigo}"
  quiet-link:
    textColor: "{colors.ink-muted}"
  quiet-link-hover:
    textColor: "{colors.indigo}"
  language-switch:
    textColor: "{colors.ink-muted}"
    height: "2.25rem"
  language-switch-hover:
    textColor: "{colors.indigo}"
  caption:
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    width: "{spacing.measure}"
  caption-label:
    textColor: "{colors.ink}"
  source-line:
    textColor: "{colors.ink-muted}"
    typography: "{typography.source}"
  figure-plate:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.frame}"
    padding: "0.75rem"
  table-cell:
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    padding: "0.45rem 0.75rem"
  table-row-deployment:
    backgroundColor: "{colors.indigo-wash}"
    textColor: "{colors.ink}"
  glance-number:
    textColor: "{colors.ink}"
    typography: "{typography.glance-number}"
  glance-note:
    textColor: "{colors.ink-muted}"
    typography: "{typography.small}"
  bibtex-entry:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.frame}"
    padding: "1rem 1.1rem"
---

# Design System: Beyond Similarity

## Overview

**Creative North Star: "The Collator's Page"**

The page is set the way a collated text is marked up: ink on white paper, annotation in indigo, and vermilion only where a mark is stamped. It inherits the visual world of the Explorer, the public site that shows every intertextual pair in its context, and carries it to the paper page, whose English and Chinese versions share one structure, one layout and one set of tokens.

Density is that of a scholarly reading page. A 45rem column carries the argument at a measured line length, and on wide screens a 17.5rem margin carries the paper's numbers. Type is the reader's own system sans at reading sizes, with weight rather than size doing most of the work of hierarchy; Songti appears only where classical Chinese is quoted. Structure is drawn with hairlines, never lifted with shadows or boxed into cards. Color carries meaning or stays out: indigo marks where the reader can act and where the reader is, vermilion is the seal and the question numerals, and everything else is ink.

The product rejects marketing rhetoric (gradients, oversized slogans, stacks of cards), false-precision numbers, and color that carries no meaning.

**Key Characteristics:**
- White paper, ink text, indigo annotation and vermilion marks, with a paired dark theme that follows the reader's system setting.
- One platform sans for everything read or operated; Songti for classical Chinese quotations only.
- A 45rem reading column beside a 17.5rem margin, with the measure set per language: 34em in English, 37em in Chinese.
- Hairline rules and three flat grounds for structure; no shadows, gradients or cards.
- Numbers set as text, on tabular figures wherever they are compared.

## Colors

A cool collation palette: near-black ink and blue-grey hairlines on white, one blue for annotation and one red for marks. The light paper is pure white; every other neutral leans toward the indigo hue (255° to 265° in OKLCH) at a chroma of 0.02 or less, so the page reads as one ink family.

### Primary
- **Annotation Indigo** (#1c50a7; dark #78a5ef): links in running text, the page list, the link row, the copy button, the focus ring, and the hover state of every quiet link. A running-text link is underlined in this indigo at 40% opacity, and the underline turns solid on hover. On paper it reads 7.6:1 in light and 7.8:1 in dark.
- **Indigo Wash** (#e7edf7; dark #222935): marks the reader's position and answers the pointer, as the ground of text selection, of the hovered link-row item and copy button, and of the deployment model's row in the twelve-model table.

### Secondary
- **Seal Vermilion** (#b2392b; dark #e87a65): the scroll seal in the masthead and the question numerals, and nothing else on the page. The seal is raster artwork taken from the Explorer, with its own light and dark files; its red (#af382a, dark #e77b66, as the SVG favicon traces it) sits within three units per sRGB channel of this token.
- **On Vermilion** (#ffffff; dark #0b0e14): the digit inside a question numeral, 6.0:1 in light and 6.8:1 in dark.

### Neutral
- **Paper** (#ffffff; dark #0b0e14): the page itself, and the ground of the copy button.
- **Ink** (#13161c; dark #e5e8ed): reading text, headings, caption labels, glance numbers, author names and table text; 18.1:1 on paper in light, 15.7:1 in dark.
- **Muted Ink** (#525862; dark #9ca2ab): secondary text (captions, affiliations, glance notes, source lines, quiet links, the language switch and the footer) and the 1.5px rules that close a table's header and body; 7.2:1 on paper in light, 7.5:1 in dark.
- **Wash** (#f0f3f7; dark #13171f): the ground of the BibTeX entry.
- **Hairline** (#dfe2e7; dark #292e36): every 1px rule and border (masthead, page list, glance margin, table rows, link-row items, frames), the underline of quiet links and author names, and the scrollbar thumb of the scrolling table and BibTeX regions.
- **Plate White** (#ffffff in both themes): the ground of the figure plates, which keeps the paper's figures in the colors they were published with when the page turns dark.

### Named Rules
**The Two Marks Rule.** Vermilion stamps two things: the scroll seal and the question numerals. Links, emphasis, highlights, glance numbers and the page's own rules and grounds never take it. The paper's figures keep their published colors on their white plates.

**The Annotation Rule.** Indigo appears only where the reader can act or where the reader is: running-text links, the page list, the link row, the copy button, the focus ring, selection, hovered controls and the deployment model's row. Links that support the reading rather than lead it stay muted until pointed at, author names stay ink, and no text takes indigo for emphasis, however important it is.

**The Paired Theme Rule.** Every color token except Plate White has a dark counterpart, switched by the reader's system setting, and every text pair clears WCAG AA in both themes; the closest pair, indigo on indigo wash in the dark theme, reads 5.9:1.

## Typography

**Display Font:** none. The paper's title is a headline in the body font.
**Body Font:** the platform sans: -apple-system and BlinkMacSystemFont (SF Pro on Apple systems), Segoe UI, then PingFang SC, Hiragino Sans GB, Noto Sans SC and Microsoft YaHei for Chinese, with system-ui and sans-serif last.
**Classical Font:** Songti SC and Songti TC, then Noto Serif CJK, Source Han Serif and SimSun, then serif.
**Label/Mono Font:** ui-monospace, SF Mono, Menlo, Consolas, monospace, for the BibTeX entry only.

**Character:** The reader's own system face lets the page speak plainly for the paper instead of in a brand voice, and it sets Latin and Chinese text side by side without a seam. Against it, the Song face the paper uses for its quotations makes classical Chinese recognizable at a glance.

### Hierarchy
- **Headline** (650, clamp(1.75rem, 1.15rem + 1.9vw, 2.3rem), 1.2, -0.012em): the paper's title, once per page; 28px on a 390px screen and 36.8px from a viewport about 968px wide.
- **Title** (650, 1.4375rem, 1.25, -0.005em): section headings, with the question numeral before the text on question sections.
- **Subtitle** (650, 1.125rem, 1.25): subheadings within a section.
- **Lead** (400, 1.1875rem, 1.6; 1.75 in Chinese): the one-sentence finding on the first screen and the answer sentence that opens each question section, at the measure.
- **Body** (400, 1.0625rem, 1.65; 1.85 in Chinese, whose characters fill the em box): reading text, at the measure. Paragraphs wrap with text-wrap: pretty, headings with text-wrap: balance.
- **Glance Number** (650, 1.6rem, 1.15, -0.01em, tabular lining figures): the quantities in "At a glance".
- **Label** (650, 1rem, 1.25): the headings "At a glance" and "On this page".
- **Control** (550, 0.9375rem): link-row items and the copy button. The language switch takes the same size at 400.
- **Small** (400, 0.875rem, 1.5): affiliations and glance notes, the notes capped at the measure. The corresponding-author note, the copy status and the footer take the same size at the body's line height.
- **Caption** (400, 0.875rem, 1.55): figure and table captions, at the measure; the label inside a caption is ink at 650.
- **Table** (400, 0.875rem, 1.45, tabular lining figures): table cells; header cells at 600, row headers at 400.
- **Source** (400, 0.8125rem, 1.5): the source line after a paragraph.
- **Code** (400, 0.8125rem, 1.6): the BibTeX entry.
- **Classical** (size and weight of the surrounding text): classical Chinese quotations, in English and Chinese prose alike.

Affiliation numbers and the corresponding-author mark are superscripts at 0.68em in muted ink, on tabular figures. Identifiers in running text, such as model names, are code spans that keep the body font and size and never break at their hyphens.

### Named Rules
**The Reading Face Rule.** One platform sans sets the title, the headings, the reading text and every control, and weight 650 against 400 does most of the work of hierarchy. On the page the title stops at 2.3rem. The system has no display voice; a surface that needs one gets it from a change of direction, never by enlarging the platform sans.

**The Measure Rule.** Reading text runs to 34em in English and 37em in Chinese, counted in the em of the element that sets it: 578px for body text, 646px for a lead sentence and 476px for a caption in English, and 629px, 703px and 518px in Chinese.

**The Song Rule.** Classical Chinese quotations, and nothing else, are set in Songti, in the script of their source edition, inside the quotation marks of the page language: curly quotes in English prose, 「」 in Chinese prose.

## Layout

The page is one reading column with a margin, centered in a frame that the masthead, the content and the footer share. The frame's content box is 67.5rem: the 45rem column, a 5rem gap and the 17.5rem margin column. Gutters of clamp(1.25rem, 4vw, 3rem) pad it on both sides, so the frame is at most 73.5rem (1176px) wide.

Below 68rem the first screen stacks in one column: the title block and the finding, then "At a glance", then the page list. The sections keep to the 45rem column at every width. From 68rem the first screen becomes a grid. The title block, the finding and the page list fill the column; "At a glance" sits in the margin column behind a 1px hairline, with 1.75rem of padding on its left, starting 0.4rem below the top of the title. Between 68rem and about 73.4rem the gutters leave less room than the full grid needs, so the column gives up width and the margin keeps its 17.5rem. Below 48rem the page list folds into a closed disclosure.

The sections follow in the column. Column figures are at most 40rem wide. From 68rem the wide framework figure and the twelve-model table span the column, the gap and the margin (1080px at full width); below 68rem they keep to the column, and a wide table scrolls sideways inside its own focusable region.

Vertical rhythm, from the top:
- **Masthead:** at least 3.5rem tall, hairline below.
- **First screen:** 2.5rem of space above, rows 2rem apart, 1.5rem between the title block and the finding. Inside the title block the authors sit 1.1rem below the title, the affiliations 0.35rem below the authors, and the link row 1.35rem below the corresponding-author note.
- **Page list:** hairline above, 1rem of padding above the heading, items 0.4rem apart.
- **Sections:** 3.5rem apart; the answer sentence 1rem below the heading; paragraphs 0.9rem apart; subheadings 2.25rem above; figures and tables 2rem above; a caption 0.75rem from its plate or table.
- **Footer:** 5rem below the last section, hairline above, padded 1.5rem above and 2.5rem below, lines 0.35rem apart.

The space above every heading exceeds the space below it. Sections and subheadings reached by an anchor stop 1.5rem below the top of the viewport, and the jump scrolls smoothly only when the reader has not asked for reduced motion. Every standalone control (link-row items, language links, the copy button and the summary of the folded page list) is at least 2.25rem (36px) tall.

### Named Rules
**The Margin Rule.** The margin column holds "At a glance" on the first screen and lends its width to wide figures and tables below it. Nothing else goes there, and below 68rem it folds back into the column.

## Elevation & Depth

The system is flat. There is no box-shadow, text-shadow, gradient, blur or translucent layer anywhere. Regions are separated by 1px hairlines and by three flat grounds: paper for the page, wash for the BibTeX entry, and indigo wash for selection, hovered controls and the deployment-model row. In the dark theme the figure plates stay white and become the brightest surfaces on the page, so the paper's figures read as published.

### Named Rules
**The Hairline Rule.** Structure is drawn, never lifted: 1px rules in the hairline color separate the masthead, the page list, the margin column, table rows, the footer and every frame. The only heavier lines are the 1.5px muted-ink rules under a table's header row and under its last body row.

## Shapes

Corners are square unless an object is framed, and the radius grows with the object: 2px on the focus ring, 3px on the 1.25rem page-list numeral, 4px on the 1.6rem heading numeral, 6px on controls (link-row items, the copy button, the skip link) and 8px on frames (figure plates, the BibTeX entry). There are no pills, circles or card radii. Borders are 1px hairlines, except the copy button's 1px indigo border and the 1.5px muted-ink table rules. The one drawn glyph, the chevron of the folded page list, is the right and bottom borders (1.5px, muted ink) of a 0.45rem square, turned 45° when closed and -135° when open.

## Components

### Buttons
Two quiet controls, both named in words, neither filled at rest.
- **Link row** (arXiv, PDF, Explorer, Cite; the last jumps to the citation section): 6px radius, 1px hairline border, no fill, Control type in indigo with no underline, at least 2.25rem tall with 0.85rem of padding at each side, items 0.5rem apart and wrapping on narrow screens.
- **Link row hover / focus:** the border turns indigo and the item fills with indigo wash over 120ms ease-out; keyboard focus adds the indigo ring.
- **Copy button** (the BibTeX entry's only control): 6px radius, 1px indigo border, paper ground, Control type in indigo, at least 2.25rem tall with 0.95rem of padding at each side.
- **Copy button hover / press:** it fills with indigo wash over 120ms ease-out and moves down 1px while pressed. It stays hidden until the browser offers the Clipboard API, so a page without scripts shows no control that cannot work. The status beside it ("Copied", 「已复制」) is in muted ink at 0.875rem and is announced politely to screen readers.

### Links
- **Running-text links:** indigo, with a 1px underline at a 0.2em offset in indigo at 40%; the underline turns solid on hover.
- **Quiet links** (source lines, PDF pages, full-size images): muted ink with a hairline underline; text and underline turn indigo on hover.
- **Author names:** ink with a hairline underline that turns ink on hover, so a name reads as a name before it reads as a link.
- **Page-list links:** indigo with no underline; hover underlines the heading text and never the numeral.

### Navigation
- **Masthead:** one row at least 3.5rem tall on the page frame, hairline below. The brand on the left is the 28px seal (light and dark artwork switched by the color-scheme preference) beside the short title at 1.0625rem and 600 in ink, letter-spaced 0.005em, with no underline; it links to the top of the page in its own language.
- **Language switch:** right-aligned in the masthead, a list of the other language pages, each named in its own language ("English", 「中文」) and marked with lang and hreflang, so the link reads correctly from either page. Each is muted ink at 0.9375rem with no underline, turning indigo on hover, at least 2.25rem tall, 1rem apart. Its place in the masthead already marks it as navigation.
- **Page list** ("On this page", 「本页内容」): after the finding on wide screens and after "At a glance" on narrow ones, hairline above, a Label heading over an ordered list of every section, items 0.4rem apart. Question items carry their numeral 0.6rem before the text; the other sections are indented 1.85rem so their text lines up with the question text. Below 48rem the list sits in a closed disclosure whose summary is the heading with the drawn chevron. CSS alone switches between the two renderings.

### Question Numerals
The seal's echo: a small vermilion square stamped before each reader question.
- **Style:** vermilion ground, the digit in on-vermilion at 650 on tabular figures, centered.
- **Heading size:** a 1.6rem square with a 4px radius and a 0.875rem digit, 0.75rem before the heading text and raised 0.12em.
- **Page-list size:** a 1.25rem square with a 3px radius and a 0.75rem digit, raised 0.08em.
- **Use:** question sections only, numbered from 1 in reading order, and the page list repeats the same numbers. Abstract, Limitations, Using this work, Cite and Acknowledgments carry none. The numeral is hidden from assistive technology; the heading text carries the meaning.

### Captions and Figure Plates
- **Figure plate:** plate white in both themes, 0.75rem of padding, 1px hairline border, 8px radius; the whole plate links to the full-size image. Column figures are at most 40rem wide; the wide framework figure spans into the margin from 68rem.
- **Caption:** below a figure's plate and above a table, 0.75rem from it, in Caption type and muted ink, at the measure. It opens with the label in ink at 650 ("Figure 1." in English, 「图 1」 in Chinese with no period), which never breaks from its number, and closes with quiet links: "Open full size · PDF p. 2" for a figure, the PDF page for a table. A table's caption stays outside the table's scrolling region, so it never scrolls away.

### Table Frames
A printed scholarly table, kept as text.
- **Type:** Table type on tabular lining figures, borders collapsed, at least as wide as its column.
- **Cells:** 0.45rem by 0.75rem of padding; numbers right-aligned and never wrapped; the first column flush left with no left padding; category columns left-aligned; long row headers wrap, at least 14rem wide.
- **Rules:** a 1px hairline under every row, and a 1.5px muted-ink rule under the header row and under the last body row. Header cells are ink at 600, aligned to the bottom; a total row is set at 600 with no rule.
- **Highlight:** the deployment model's row takes the indigo wash, the color of the reader's position.
- **Scrolling:** the table sits in a focusable region named after it, which scrolls sideways on narrow screens with a hairline scrollbar thumb. The row labels stay put on the paper ground while the numbers scroll.

### At a Glance
The paper's numbers, each beside its qualification.
- **Structure:** an aside with a Label heading over a definition list, entries 1.15rem apart and the first 0.9rem below the heading.
- **Entry:** the quantity in Glance Number type and ink, 0.15rem above its note in Small type and muted ink. Quantities follow the page language: an en dash in ranges and "×" for multiples in English, 「～」 in ranges and 「倍」 for multiples in Chinese.
- **Placement:** the margin column from 68rem, behind its 1px hairline; directly after the finding on narrower screens.
- **Restraint:** no accent color, no box and no icon. A number never appears without the note that says what it counts and under what condition.

### BibTeX Entry
- **Frame:** wash ground, 1px hairline border, 8px radius, a region named after the entry, with 1rem by 1.1rem of padding. Long fields wrap inside the frame instead of scrolling.
- **Text:** Code type in ink, in English on both pages, as arXiv records the title and the authors. The copy button sits 0.75rem below.

### Source Lines
A source line follows the paragraph it supports, inline, in Source type and muted ink: a lead ("Source:", 「出处：」) and quiet links named by part and page ("Introduction · PDF p. 1"), separated by "; " in English and 「；」 in Chinese, each opening the arXiv v1 PDF at that page.

### Focus, Selection and Skip Link
- **Focus:** every focusable element shows a 2px solid indigo ring on focus-visible, offset 2px. An element without a radius of its own takes 2px while focused; framed controls keep theirs.
- **Selection:** indigo wash under ink text.
- **Skip link:** above the viewport until focused, then 0.75rem from the top on the paper ground, with a hairline border and a 6px radius.

### Named Rules
**The Quiet Secondary Rule.** A link that supports the reading (a source, a PDF page, a full-size image) recedes in muted ink with a hairline underline and turns indigo only when pointed at. The language switch recedes the same way without the underline.

## Do's and Don'ts

### Do:
- **Do** keep vermilion (#b2392b, dark #e87a65) to the scroll seal and the question numerals.
- **Do** use indigo only where the reader can act or where the reader is: running-text links, the page list, the link row, the copy button, the focus ring, selection, hovered controls and the deployment model's row.
- **Do** set reading text at 1.0625rem with a 1.65 line height (1.85 in Chinese) and cap it at the language's measure: 34em in English, 37em in Chinese.
- **Do** set classical Chinese quotations in the Songti stack, in the script of their source edition, inside the page language's quotation marks.
- **Do** put compared numbers on tabular lining figures, and keep a label with its number, a statistic with its value and a number with its unit on one line.
- **Do** caption figures below the plate and tables above the frame, with the label in ink at 650 and quiet links to the full-size image or the PDF page.
- **Do** keep figure plates white in both themes.
- **Do** name every link and control in words; the only drawn glyph is the chevron of the folded page list.
- **Do** give every new color token a dark counterpart and keep every text pair at WCAG AA or better in both themes.

### Don't:
- **Don't** use vermilion for links, emphasis, highlights, glance numbers, rules or grounds.
- **Don't** add shadows, gradients, glass or cards; separate regions with 1px hairlines and the flat grounds.
- **Don't** enlarge the platform sans into a display voice or a slogan; on the page the title stops at 2.3rem.
- **Don't** number a section that is not a reader's question.
- **Don't** give a glance number color, a box or an icon, or show it without its qualifying note.
- **Don't** set anything but classical Chinese quotations in Songti, or anything but the BibTeX entry in monospace.
- **Don't** round a styled corner past 8px; there are no pills, circles or card radii.
