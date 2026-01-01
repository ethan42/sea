// Compiler initialization for Sea
// import wasmerSDKModule from "@wasmer/sdk/wasm?url";

let WasmerSDK = null;
let clangPackage = null;
let wasmerInitialized = false;
let compilerWorker = null;

export async function initCompiler(log, setStatus, progressBar, loadingText, loadingSubtext, compilerStatus) {
    loadingSubtext.textContent = 'Loading wasm-clang compiler...';
    progressBar.style.width = '30%';
    loadingText.textContent = 'Setting up clang';
    wasmerInitialized = true;
    compilerStatus.textContent = 'Clang (Ready)';
    compilerStatus.style.color = '#3fb950';
    return;
    // Only create the worker once
    if (!compilerWorker) {
        compilerWorker = new Worker('/wasm-clang/worker.js');
    }
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Compiler initialization timed out (20s)'));
        }, 20000);
        function handleReady(e) {
            const data = e.data;
            if (data.type === 'ready') {
                clearTimeout(timeout);
                wasmerInitialized = true;
                compilerStatus.textContent = 'Clang (Ready)';
                compilerStatus.style.color = '#3fb950';
                compilerWorker.removeEventListener('message', handleReady);
                resolve();
            } else if (data.type === 'write') {
                if (data.text) {
                    log(data.text.replace(/\n$/, ''), 'stdout');
                }
            }
        }
        compilerWorker.addEventListener('message', handleReady);
        compilerWorker.onerror = (err) => {
            clearTimeout(timeout);
            compilerWorker.removeEventListener('message', handleReady);
            reject(new Error(`Worker error: ${err.message || 'Unknown error'}`));
        };
        loadingSubtext.textContent = 'Initializing Clang compiler (~30MB download)...';
        progressBar.style.width = '60%';
    });
}

export function getWasmerSDK() {
    return WasmerSDK;
}
export function getClangPackage() {
    return clangPackage;
}
export function isWasmerInitialized() {
    return wasmerInitialized;
}
