import { defineConfig } from 'astro/config'

// `site` is the only place the public origin is written; canonical URLs and
// other absolute links resolve against it.
export default defineConfig({
  site: 'https://beyond-similarity.zhaoji.ac.cn',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
})
