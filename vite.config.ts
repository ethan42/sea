import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  // Base path - change this if deploying to a subdirectory
  base: './',

  build: {
    outDir: 'dist',
    // Ensure assets are in a predictable location
    assetsDir: 'assets',
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Required for top-level await
    target: 'esnext',
  },

  plugins: [
    // WASM support
    wasm(),
    topLevelAwait(),
  ],

  // Using 'credentialless' instead of 'require-corp' to allow cross-origin fetches
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },

  optimizeDeps: {
    include: ['monaco-editor'],
  },

  // Worker configuration for Monaco
  worker: {
    format: 'es'
  }
});

