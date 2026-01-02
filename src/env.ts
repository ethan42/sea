// Compile and run logic for Sea
import { getEditor } from './editor.js';

type TerminalCallback = (message: string, type?: string) => void;

interface ResponseCallback {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
}

class InBrowserEnvironment {
    private nextResponseId: number = 0;
    private responseCBs: Map<number, ResponseCallback> = new Map();
    private worker: Worker;
    private port: MessagePort;
    public terminal: TerminalCallback;
    private skip_newlines: boolean = false;
    public in_compiling: boolean = false;

    constructor(terminal: TerminalCallback) {
        this.worker = new Worker('worker.js');
        const channel = new MessageChannel();
        this.port = channel.port1;
        this.port.onmessage = this.onmessage.bind(this);

        const remotePort = channel.port2;
        this.worker.postMessage({ id: 'constructor', data: remotePort },
            [remotePort]);
        this.terminal = terminal;
        this.setShowTiming(true);
        this.skip_newlines = false;
        this.in_compiling = false;
    }

    setShowTiming(value: boolean): void {
        this.port.postMessage({ id: 'setShowTiming', data: value });
    }

    terminate(): void {
        this.worker.terminate();
    }

    private runAsync(id: string, options: any): Promise<any> {
        const responseId = this.nextResponseId++;
        const responsePromise = new Promise((resolve, reject) => {
            this.responseCBs.set(responseId, { resolve, reject });
        });
        this.port.postMessage({ id, responseId, data: options });
        return responsePromise;
    }

    compileLinkRun(contents: string): Promise<any> {
        return this.runAsync('compileLinkRun', contents);
    }

    private onmessage(event: MessageEvent): void {
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

let env: InBrowserEnvironment | null = null;

export async function initCompiler(
    log: TerminalCallback,
    setStatus: (status: string) => void,
    progressBar: HTMLElement,
    loadingText: HTMLElement,
    loadingSubtext: HTMLElement,
    compilerStatus: HTMLElement,
    runBtn: HTMLButtonElement
): Promise<void> {
    if (env) return;
    runBtn.disabled = true;
    loadingSubtext.textContent = 'Loading wasm-clang compiler...';
    progressBar.style.width = '30%';
    loadingText.textContent = 'Setting up clang';
    const devnull: TerminalCallback = (msg: string, type?: string) => {};
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
    runBtn.disabled = false;
    return;
}

export async function runCode(
    log: TerminalCallback,
    setStatus: (status: string) => void,
    runBtn: HTMLButtonElement,
    stdinInput: HTMLInputElement
): Promise<void> {
    runBtn.disabled = true;
    setStatus('running');
    const editor = getEditor();
    const code = editor.getValue();
    log('Compiling and running...', 'system');
    try {
        if (env) {
            env.terminal = log;
            await env.compileLinkRun(code);
        }
        setStatus('ready');
    } catch (error) {
        const err = error as Error;
        log(`Error: ${err.message}`, 'stderr');
        setStatus('error');
    } finally {
        runBtn.disabled = false;
    }
}

