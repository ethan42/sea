#!/usr/bin/env node
// Downloads clang WASM package from Wasmer registry at build time

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const CLANG_DIR = 'public/clang';
const WEBC_FILE = join(CLANG_DIR, 'clang.webc');

async function getPackageUrl() {
    // Query the Wasmer GraphQL API to get the download URL
    const query = `
        query {
            getPackage(name: "clang/clang") {
                lastVersion {
                    distribution {
                        downloadUrl
                    }
                }
            }
        }
    `;

    const response = await fetch('https://registry.wasmer.io/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.getPackage.lastVersion.distribution.downloadUrl;
}

async function downloadClang() {
    console.log('Checking for clang package...');
    
    if (existsSync(WEBC_FILE)) {
        console.log('✓ Clang package already exists at', WEBC_FILE);
        console.log('  Delete it to re-download.');
        return;
    }

    mkdirSync(CLANG_DIR, { recursive: true });

    console.log('Fetching download URL from Wasmer registry...');
    const downloadUrl = await getPackageUrl();
    console.log('Download URL:', downloadUrl);
    
    console.log('\nDownloading clang package (~100MB)...');
    console.log('This may take a few minutes...\n');
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    writeFileSync(WEBC_FILE, Buffer.from(buffer));
    
    console.log('✓ Clang package downloaded to', WEBC_FILE);
    console.log('  Size:', (buffer.byteLength / 1024 / 1024).toFixed(1), 'MB');
}

downloadClang().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
