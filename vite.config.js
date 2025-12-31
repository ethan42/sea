import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
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

    // Copy coi-serviceworker.js and wasmer WASM from node_modules
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/coi-serviceworker/coi-serviceworker.js',
          dest: '.'
        }
      ]
    }),
    // Serve files from node_modules during dev
    {
      name: 'serve-node-modules-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes('webc')) {
            const filePath = path.resolve(__dirname, 'public/clang/clang.webc');
            res.setHeader('Content-Type', 'application/webc');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
          // if (req.url === '/coi-serviceworker.js') {
          //   const filePath = path.resolve(__dirname, 'node_modules/coi-serviceworker/coi-serviceworker.js');
          //   res.setHeader('Content-Type', 'application/javascript');
          //   fs.createReadStream(filePath).pipe(res);
          //   return;
          // }
          // Serve wasmer WASM file with correct MIME type
          // if (req.url?.includes('wasmer_js_bg.wasm')) {
          //   const filePath = path.resolve(__dirname, 'node_modules/@wasmer/sdk/dist/wasmer_js_bg.wasm');
          //   res.setHeader('Content-Type', 'application/wasm');
          //   fs.createReadStream(filePath).pipe(res);
          //   return;
          // }
          next();
        });
      }
    }
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
