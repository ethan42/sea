#!/usr/bin/env node
// Downloads wasm-clang assets from binji.github.io

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/ethan42/wasm-clang/refs/heads/master';
const PUBLIC_DIR = 'public/';

const ASSETS = [
    'clang',           // clang compiler (wasm)
    'lld',             // lld linker (wasm)
    'memfs',           // in-memory filesystem (wasm)
    'sysroot.tar',     // C/C++ headers and libraries
    'shared.js',       // shared utilities
    'worker.js',       // web worker for compilation
];

async function downloadFile(filename) {
    const url = `${BASE_URL}/${filename}`;
    const destPath = join(PUBLIC_DIR, filename);

    if (existsSync(destPath)) {
        console.log(`  ✓ ${filename} (cached)`);
        return;
    }

    console.log(`  ↓ Downloading ${filename}...`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download ${filename}: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    writeFileSync(destPath, Buffer.from(buffer));

    const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`    Downloaded ${sizeMB} MB`);
}

async function main() {
    console.log('Setting up wasm-clang assets...\n');

    // Create directory
    mkdirSync(PUBLIC_DIR, { recursive: true });

    // Download main assets
    console.log('Downloading from binji.github.io/wasm-clang:');
    for (const asset of ASSETS) {
        try {
            await downloadFile(asset);
        } catch (err) {
            console.error(`  ✗ Failed to download ${asset}: ${err.message}`);
        }
    }

    console.log('\n✓ Assets downloaded!');
    console.log(`\nRun 'npm run dev' to start the development server.`);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
