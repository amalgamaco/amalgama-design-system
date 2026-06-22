import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Builds ONE self-mounting bundle (dist/embassy-islands.js + .css) that
// index.html loads. On load it scans for [data-island] placeholders and
// renders the matching shadcn/ui showcase into each — nothing else in the
// page is touched.
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
