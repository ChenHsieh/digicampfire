import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/rss': {
        target: 'https://www.theguardian.com/world/rss',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rss/, ''),
      },
    },
  },
});