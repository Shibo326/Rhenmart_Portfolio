import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/app/tests/setup.ts'],
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    // Increase chunk warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router'],
          'motion': ['motion'],
          'icons': ['lucide-react'],
          'emailjs': ['@emailjs/browser'],
        },
      },
    },
    // Minify with esbuild (faster + smaller)
    minify: 'esbuild',
    // Target modern browsers only
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Reduce sourcemap size in prod
    sourcemap: false,
  },
  // Optimize deps pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion', 'lucide-react'],
    exclude: [],
  },
})
