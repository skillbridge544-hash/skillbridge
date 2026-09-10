import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },

  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },

  build: {
    // Output directory (matched in vercel.json)
    outDir: 'dist',

    // Generate source maps for error tracking in production
    sourcemap: false,

    // Raise chunk size warning limit to 1MB
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion'],
          supabase: ['@supabase/supabase-js'],
          icons: [
            'lucide-react',
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
          ],
        },
      },
    },
  },
});
