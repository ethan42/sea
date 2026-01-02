# Sea — In-Browser C Compiler

> C code editor & compiler running fully in your browser. Powered by Monaco Editor and Clang (via [binji/wasm-clang](https://github.com/binji/wasm-clang)).

## Quick Start

```bash
bun run setup    # Install deps & download clang (~30MB, one-time)
bun run dev      # Start dev server
bun run build    # Build for production
bun run preview  # Preview production build
```

## Build & Deploy

`dist/` contains the static site after `bun run build`. Upload it to any static host (GitHub Pages, Netlify, Vercel, etc).

For best performance, set these headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

If you can't set headers, the service worker will polyfill (may require reload).

## Dependencies

All dependencies are managed via Bun:

| Package         | Purpose                  |
|-----------------|--------------------------|
| monaco-editor   | Code editor (VS Code UI) |
| vite            | Build tool & dev server  |
| typescript      | Type safety              |

## Updating Dependencies

```bash
bun outdated      # Check for updates
bun update        # Update all
bun add <pkg>     # Add/update specific package
bun run build     # Rebuild
```

## Features

- Real Clang compiler (not an interpreter)
- Standard C library (stdio.h, etc)
- Monaco Editor (syntax, shortcuts)
- Example programs included
- Stdin support
- 100% client-side

## How It Works

1. C code is written to a virtual FS
2. Clang (WASM) compiles to WebAssembly
3. Output runs in-browser

On first load, Clang (~30MB) is downloaded & cached.

## Requirements

- [Bun](https://bun.sh) (package manager and runtime)
- Modern browser (WebAssembly, SharedArrayBuffer)

## License

MIT
