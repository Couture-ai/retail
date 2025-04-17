import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  base: '/retail',
  resolve: {
    alias: {
      ace: 'ace-builds/src-noconflict' // Ensure correct resolution of Ace modules
    }
  },
  plugins: [
    compression(),
    // ViteCompression({
    //   algorithm: 'brotli' // Or 'gzip' for gzip compression
    // }),
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic'
        });
      }
    },

    react()
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    open: true // Automatically open the app in the browser
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Set to a value higher than the default (500 KB) if you want larger chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('ace-builds')) {
            return 'ace'; // Group ace-related modules into their own chunk
          }
          if (id.includes('node_modules')) {
            return 'vendor'; // Group all dependencies into a "vendor" chunk
          }
        }
      }
    },
    outDir: 'build' // Use 'build' as the output directory to match CRA's default
  }
});
