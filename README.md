# Sea — In-Browser C Compiler: What you sea is what you get!

A fully-featured C code editor and compiler that runs entirely in your browser. Uses Monaco Editor and Clang compiled to WebAssembly via [binji/wasm-clang](https://github.com/binji/wasm-clang).

## Quick Start

```bash
# Install dependencies and download clang (~30MB, one-time)
npm run setup

# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Setup Details

The `npm run setup` command:
1. Installs npm dependencies
2. Downloads the Clang compiler package (~30MB) to `public/`

The clang package is downloaded once and cached locally. This avoids CORS issues and makes the app work offline.

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder containing:
- `index.html`
- `assets/` (bundled JS/CSS)

Upload the entire `dist/` folder to any static host.

## Deployment

### GitHub Pages / Netlify / Vercel
Just upload the `dist/` folder.

### Traditional Web Server
For best performance, configure your server to send these headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

If you can't set headers, the included service worker will handle it (with a page reload on first visit).

## Dependencies

All dependencies are managed via npm and bundled at build time:

| Package | Purpose |
|---------|---------|
| `monaco-editor` | VS Code-quality code editor |
| `vite` | Fast build tool and dev server |

## Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Or update specific package
npm install monaco-editor@latest
```

Then rebuild:
```bash
npm run build
```

## Features

- **Full C Compiler**: Real Clang compiler, not an interpreter
- **Standard Library**: stdio.h, stdlib.h, string.h etc.
- **Monaco Editor**: Syntax highlighting, auto-indent, keyboard shortcuts
- **8 Example Programs**: Learn C with built-in examples
- **Stdin Support**: Provide input to your programs
- **No Backend**: Everything runs in your browser

## How It Works

1. Your C code is written to a virtual filesystem
2. Clang (compiled to WASM) compiles it to WebAssembly
3. The resulting WASM is executed within your browser
4. Output is displayed in the console

## First Load

On first load, the browser downloads the Clang compiler (~30MB). This is cached by the browser for subsequent visits.

## Browser Requirements

- Modern browser with WebAssembly support
- SharedArrayBuffer support (enabled via service worker)
- Chrome, Firefox, Edge, Safari all supported

## License

MIT
