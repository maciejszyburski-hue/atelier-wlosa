import { defineConfig } from 'vite'

export default defineConfig({
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
