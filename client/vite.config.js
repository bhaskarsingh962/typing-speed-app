import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port : 5181,
    proxy: {
      '/api': {
        target:  import.meta.env.BACKEND_URL, // Your backend server's address
        changeOrigin: true,
      },
    }
  }
})
