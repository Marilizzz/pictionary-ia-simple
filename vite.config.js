import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // ← Esto permite --host y que funcione en cualquier red
    port: 5173,    // Puerto por defecto (puedes cambiarlo si quieres)
    strictPort: true,
  },
})