# Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories

This repository holds the source of the paper page for the arXiv preprint by Zhaoji Wang, Wanyu Si, and Jun Wang.

- Paper page: <https://beyond-similarity.zhaoji.ac.cn/>
- arXiv record: <https://arxiv.org/abs/2607.27595>
- Explorer (in Chinese), which shows every intertextual pair from the Twenty-Four Histories run in its textual context: <https://analects-24histories-intertext.pkudh.net/>

## The paper

Similarity scores and parallel-passage lists show where one text reuses another but not how or why. In the paper, an LLM agent reads one book of the *Analects* and one scroll of a history in full, may record an intertextual pair only after grounding both fragments in exact character spans, and labels each pair under a five-dimension typology of reuse. Against an expert-adjudicated benchmark of 2,533 intertextual pairs between the *Analects* and the *Book of Han*, 12 LLMs reach 55.9% to 92.9% precision. The deployment model then extracted 5,766 intertextual pairs from 65,380 comparisons over the Twenty-Four Histories. Across them, no systematic change is detected in the share of direct quotation or of reuse that leaves its source unmarked, while later-compiled histories tend to quote the same passage less literally.

## Cite

```bibtex
@misc{wang2026beyond,
  title         = {Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories},
  author        = {Wang, Zhaoji and Si, Wanyu and Wang, Jun},
  year          = {2026},
  eprint        = {2607.27595},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL},
  doi           = {10.48550/arXiv.2607.27595},
  url           = {https://arxiv.org/abs/2607.27595}
}
```

## Development

The site is built with Astro and TypeScript into static files. It needs Node.js 24 or later and pnpm.

```sh
pnpm install
pnpm build                              # type-check with astro check, then build into dist/
pnpm exec playwright install chromium   # once, to download the test browser
pnpm test                               # serve dist/ with astro preview and run the Playwright tests
pnpm dev                                # development server
```

`pnpm test` tests the build in `dist/`, so run `pnpm build` first. The preview listens on port 4321. Set `PREVIEW_PORT` to use another port, for example when two checkouts run their tests at the same time. A busy port fails the run instead of reusing a server that may belong to another checkout. Set `BASE_URL` to run the same tests against a deployed site, in which case nothing is started locally.

```sh
PREVIEW_PORT=4322 pnpm test
BASE_URL=https://beyond-similarity.zhaoji.ac.cn/ pnpm test
```

CI type-checks, builds, and tests every pull request and every push to `main`. On `main`, the build that passed the tests is published as the contents of the `site` branch: one commit per build, holding only the built files, with the source commit in its message.

## License

The code in this repository is released under the [MIT License](LICENSE). The text and figures of the paper page remain under the authors' copyright, with all rights reserved. The MIT License does not apply to them.
