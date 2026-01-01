import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  // Required for SharedArrayBuffer (Wasmer SDK)
  // Using 'credentialless' instead of 'require-corp' to allow cross-origin fetches
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      // Proxy Wasmer registry to avoid CORS issues in dev
      '/wasmer-registry': {
        target: 'https://registry.wasmer.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wasmer-registry/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Remove headers that cause CORS issues
            proxyReq.removeHeader('user-agent');
          });
        },
      },
    },
  },

  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    }
  },

  // Optimize deps - exclude wasmer to let WASM plugin handle it
  optimizeDeps: {
    include: ['monaco-editor'],
    exclude: ['@wasmer/sdk']
  },

  // Worker configuration for Monaco
  worker: {
    format: 'es'
  }
});
