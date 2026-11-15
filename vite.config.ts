import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function prerenderLandingPlugin(): Plugin {
  let outDir = 'dist'
  let rootDir = process.cwd()

  return {
    name: 'prerender-landing',
    apply: 'build',
    configResolved(config) {
      rootDir = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const htmlPath = resolve(outDir, 'index.html')
      const vite = await createServer({
        root: rootDir,
        logLevel: 'error',
        server: { middlewareMode: true },
        appType: 'custom',
      })
      try {
        const { renderApp } = await vite.ssrLoadModule('/src/entry-server.tsx')
        const appHtml: string = renderApp()
        const template = await readFile(htmlPath, 'utf8')
        const rendered = template.replace(
          '<div id="root"></div>',
          `<div id="root">${appHtml}</div>`,
        )
        await writeFile(htmlPath, rendered, 'utf8')
      } finally {
        await vite.close()
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), prerenderLandingPlugin()],
  server: {
    port: 5183,
    strictPort: false,
  },
})
