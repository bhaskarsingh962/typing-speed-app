import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  // Load environment variables based on mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: 5181,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5008',
          changeOrigin: true,
        },
      },
    },
  });
};
