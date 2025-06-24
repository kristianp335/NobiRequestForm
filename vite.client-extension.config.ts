import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-css',
      writeBundle() {
        copyFileSync('src/nobi-form.css', 'build/nobi-form.css')
      }
    }
  ],
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/main.tsx',
      name: 'NOBIForm',
      fileName: 'nobi-form',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: 'nobi-form.js',
        format: 'es'
      }
    },
    minify: false,
    sourcemap: false
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})