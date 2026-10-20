import { defineConfig } from 'astro/config'

// Canonical URLs, sitemap entries and metadata all derive from `site`.
export default defineConfig({
  site: 'https://beyond-similarity.zhaoji.ac.cn',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
})
