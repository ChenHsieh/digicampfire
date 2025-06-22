import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Ensure environment variables are properly handled in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          openai: ['openai'],
          motion: ['framer-motion']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Ensure source maps are generated for debugging
    sourcemap: true
  },
  // Define environment variables that should be available
  define: {
    // Ensure NODE_ENV is properly set
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});