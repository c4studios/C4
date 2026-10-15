import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath } from 'vite'
import path from 'path'
import { execFileSync } from 'node:child_process'
import { STATIC_ROUTES } from './src/lib/prerenderRoutes.js'

/* The date each static page last changed: the newest commit to any of its
   source files, the same reading scripts/prerender.mjs gives the sitemap's
   <lastmod>. Pages read it through src/lib/pageDates.js. With no git history
   a route is left out instead of getting today's date. */
function gitDate(paths) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null
  } catch {
    return null
  }
}

const PAGE_DATES = Object.fromEntries(
  STATIC_ROUTES.filter((r) => r.source)
    .map((r) => [r.path, gitDate(r.source)])
    .filter(([, date]) => date),
)

/* framer-motion, safe for hydration (15 Oct 2026). Every import of
   'framer-motion' in the app resolves to src/lib/motion.jsx, which re-exports
   the library with motion components that start at their finished state in
   the prerenderer and while a prerendered page hydrates. That file imports
   the real package, so it's left alone here. */
const MOTION = normalizePath(path.resolve(__dirname, './src/lib/motion.jsx'))
function hydrationSafeMotion() {
  return {
    name: 'c4:hydration-safe-motion',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source !== 'framer-motion' || !importer) return null
      if (normalizePath(importer.split('?')[0]).toLowerCase() === MOTION.toLowerCase()) return null
      return MOTION
    },
  }
}

export default defineConfig({
  plugins: [hydrationSafeMotion(), react()],
  define: {
    __PAGE_DATES__: JSON.stringify(PAGE_DATES),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  cacheDir: '/tmp/vite-cache',
})
