import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        galeria: resolve(__dirname, 'galeria.html'),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173,
    strictPort: true,
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 5173,
  },
})
