// Compile and run logic for Sea
import { getEditor } from './editor.js';

class InBrowserEnvironment {

    constructor(terminal) {
        this.nextResponseId = 0;
        this.responseCBs = new Map();
        this.worker = new Worker('worker.js');
        const channel = new MessageChannel();
        this.port = channel.port1;
        this.port.onmessage = this.onmessage.bind(this);

        const remotePort = channel.port2;
        this.worker.postMessage({ id: 'constructor', data: remotePort },
            [remotePort]);
        this.terminal = terminal;
    }

    setShowTiming(value) {
        this.port.postMessage({ id: 'setShowTiming', data: value });
    }

    terminate() {
        this.worker.terminate();
    }

    async runAsync(id, options) {
        const responseId = this.nextResponseId++;
        const responsePromise = new Promise((resolve, reject) => {
            this.responseCBs.set(responseId, { resolve, reject });
        });
        this.port.postMessage({ id, responseId, data: options });
        return await responsePromise;
    }

    compileLinkRun(contents) {
        this.port.postMessage({ id: 'compileLinkRun', data: contents });
    }

    onmessage(event) {
        console.log(event);
        switch (event.data.id) {
            case 'write':
                this.terminal(event.data.data, 'stdout');
                break;

            case 'runAsync': {
                const responseId = event.data.responseId;
                const promise = this.responseCBs.get(responseId);
                if (promise) {
                    this.responseCBs.delete(responseId);
                    promise.resolve(event.data.data);
                }
                break;
            }
        }
    }
}

let env = null;

export async function initCompiler(log, setStatus, progressBar, loadingText, loadingSubtext, compilerStatus) {
    if (env) return;
    loadingSubtext.textContent = 'Loading wasm-clang compiler...';
    progressBar.style.width = '30%';
    loadingText.textContent = 'Setting up clang';
    const devnull = (msg, type) => {};
    env = new InBrowserEnvironment(devnull);
    progressBar.style.width = '40%';
    loadingText.textContent = 'Initializing runtime';
    // compile a small test program to warm up
    loadingSubtext.textContent = 'Trying a test run...';
    const testCode = 'int main() { return 0; }';
    await env.compileLinkRun(testCode);
    progressBar.style.width = '100%';
    loadingText.textContent = 'Ready!';
    compilerStatus.textContent = 'Clang (Ready)';
    compilerStatus.style.color = '#3fb950';
    setStatus('ready');
    log('Sea compiler is ready!', 'success');
    return;
}

export async function runCode(log, setStatus, runBtn, stdinInput) {
    runBtn.disabled = true;
    setStatus('running');
    const editor = getEditor();
    const code = editor.getValue();
    // log('─'.repeat(50), 'system');
    // log('Compiling...', 'info');
    try {
        env.terminal = log;
        let result = await env.compileLinkRun(code);
        console.log(result);
        // log('Program output:', 'info');
        // log('─'.repeat(50), 'system');
        // log(result, 'stdout');
        // log('─'.repeat(50), 'system');
        // log(`Program finished execution`, 'success');
        setStatus('ready');
    } catch (error) {
        log(`Error: ${error.message}`, 'stderr');
        setStatus('error');
    } finally {
        runBtn.disabled = false;
    }
}
