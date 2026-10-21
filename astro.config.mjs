import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'

/**
 * Writes dist/build.json with the source commit and the build time. It
 * identifies one build: the test runner checks that the server it talks to
 * serves this checkout's build, and deployment checks which commit is live.
 */
function buildInfo() {
  return {
    name: 'build-info',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
        const info = { commit, builtAt: new Date().toISOString() }
        writeFileSync(new URL('build.json', dir), `${JSON.stringify(info, null, 2)}\n`)
      },
    },
  }
}

// `site` is the only place the public origin is written; canonical URLs and
// other absolute links resolve against it.
export default defineConfig({
  site: 'https://beyond-similarity.zhaoji.ac.cn',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [buildInfo()],
  vite: {
    preview: {
      // Without strictPort a busy port makes the preview move to the next free
      // one. A busy port now stops the preview instead.
      strictPort: true,
    },
  },
})
