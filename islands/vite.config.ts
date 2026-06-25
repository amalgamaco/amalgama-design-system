import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `@ds/*` is a short alias for the @amalgama/ds package's PUBLIC API: `@ds/button`
// → `@amalgama/ds/button`, resolved via the package's `exports` map (./* → components/ui/*).
// So the docs consume the package exactly as an external product would — dogfooding the
// public surface. The package is linked via `file:` (package.json); preserveSymlinks keeps
// its bare deps (Radix, sonner, …) resolving from islands/node_modules.

// Builds ONE self-mounting bundle (dist/embassy-islands.js + .css) that
// index.html loads. On load it scans for [data-island] placeholders and
// renders the matching shadcn/ui showcase into each — nothing else in the
// page is touched.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@ds': '@amalgama/ds' },
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        format: 'es',
        entryFileNames: 'embassy-islands.js',
        assetFileNames: 'embassy-islands.[ext]',
      },
    },
  },
})
