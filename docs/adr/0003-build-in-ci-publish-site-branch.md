# The site is built in CI and published to the `site` branch

Hosting only serves files. CI type-checks, builds, and tests every change; on `main` it publishes the built site as the contents of the `site` branch, and hosting pulls that branch with a read-only deploy key scoped to this repository. Hosting never follows `site` automatically: each deploy activates one chosen `site` commit, after checking that the commit's `build.json` names the source commit the maintainer approved. Build tooling stays out of hosting, and no hosting credentials are stored in GitHub.

## Considered Options

- GitHub Pages. Rejected: the paper page is served from the authors' own domain and hosting.
- Building on the hosting side. Rejected: hosting would need a Node toolchain and a copy of the source.
- Pushing from CI into hosting. Rejected: it requires storing hosting credentials in GitHub.
