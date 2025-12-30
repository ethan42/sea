// Sea - Main Application
import './style.css';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { EXAMPLES } from './examples.js';

// Configure Monaco workers for Vite
self.MonacoEnvironment = {
    getWorker: function () {
        return new editorWorker();
    }
};

// ============================================
// GLOBAL STATE
// ============================================
let editor = null;
let wasmerInitialized = false;
let clangPackage = null;
let isRunning = false;
let WasmerSDK = null;

// ============================================
// DOM ELEMENTS
// ============================================
const loadingOverlay = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');
const loadingSubtext = document.getElementById('loading-subtext');
const progressBar = document.getElementById('progress-bar');
const consoleOutput = document.getElementById('console-output');
const statusDot = document.getElementById('status-dot');
const outputLabel = document.getElementById('output-label');
const compilerStatus = document.getElementById('compiler-status-text');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const clearOutputBtn = document.getElementById('clear-output-btn');
const examplesBtn = document.getElementById('examples-btn');
const examplesDropdown = document.getElementById('examples-dropdown');
const stdinInput = document.getElementById('stdin-input');
const sendInputBtn = document.getElementById('send-input-btn');

// ============================================
// CONSOLE OUTPUT
// ============================================
function log(message, type = 'stdout') {
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    
    if (type === 'system') {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        const span = document.createElement('span');
        span.className = 'timestamp';
        span.textContent = `[${timestamp}] `;
        line.appendChild(span);
        line.appendChild(document.createTextNode(message));
    } else {
        line.textContent = message;
    }
    
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    consoleOutput.innerHTML = '';
}

function setStatus(status) {
    statusDot.className = 'status-dot ' + status;
    if (status === 'running') {
        outputLabel.textContent = 'Running...';
    } else if (status === 'error') {
        outputLabel.textContent = 'Error';
    } else {
        outputLabel.textContent = 'Console';
    }
}

// ============================================
// MONACO EDITOR SETUP
// ============================================
function initMonaco() {
    // Define custom theme
    monaco.editor.defineTheme('sea-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ff7b72' },
            { token: 'string', foreground: 'a5d6ff' },
            { token: 'number', foreground: '79c0ff' },
            { token: 'type', foreground: 'ffa657' },
            { token: 'function', foreground: 'd2a8ff' },
            { token: 'variable', foreground: 'e6edf3' },
            { token: 'operator', foreground: 'e6edf3' },
            { token: 'delimiter', foreground: '8b949e' },
        ],
        colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#e6edf3',
            'editor.lineHighlightBackground': '#161b22',
            'editor.selectionBackground': '#264f78',
            'editorCursor.foreground': '#58a6ff',
            'editorLineNumber.foreground': '#6e7681',
            'editorLineNumber.activeForeground': '#e6edf3',
            'editor.inactiveSelectionBackground': '#21262d',
            'editorIndentGuide.background': '#21262d',
            'editorIndentGuide.activeBackground': '#30363d',
        }
    });

    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: EXAMPLES.hello,
        language: 'c',
        theme: 'sea-dark',
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'off',
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        padding: { top: 12, bottom: 12 },
    });

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        if (!isRunning) runCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, () => {
        clearConsole();
    });
}

// ============================================
// WASMER + CLANG SETUP
// ============================================
async function initWasmer() {
    loadingSubtext.textContent = 'Loading Wasmer SDK...';
    progressBar.style.width = '30%';

    try {
        // Dynamically import Wasmer SDK
        const wasmerModule = await import('@wasmer/sdk');
        const { init, Wasmer, Directory } = wasmerModule;
        
        loadingSubtext.textContent = 'Initializing Wasmer runtime...';
        progressBar.style.width = '50%';
        
        await init();
        
        loadingSubtext.textContent = 'Loading Clang compiler...';
        loadingText.textContent = 'Loading Clang...';
        progressBar.style.width = '60%';
        
        // Store globally for use in runCode
        WasmerSDK = { Wasmer, Directory };
        
        // Load clang from local file (downloaded at build time)
        // Falls back to registry if local file not found
        try {
            const response = await fetch('/clang/clang.webc');
            if (response.ok) {
                const bytes = await response.arrayBuffer();
                clangPackage = await Wasmer.fromFile(new Uint8Array(bytes));
                log('Loaded clang from local package', 'system');
            } else {
                throw new Error('Local clang not found');
            }
        } catch (e) {
            // Fallback to registry (requires CORS workaround)
            log('Local clang not found, fetching from registry...', 'warning');
            clangPackage = await Wasmer.fromRegistry("clang/clang");
        }
        
        progressBar.style.width = '100%';
        loadingSubtext.textContent = 'Ready!';
        
        wasmerInitialized = true;
        compilerStatus.textContent = 'Clang (Ready)';
        compilerStatus.style.color = '#3fb950';
        
        log('Sea initialized successfully!', 'success');
        log('Compiler: Clang via Wasmer SDK (WebAssembly)', 'system');
        log('This is a FULL C compiler - supports stdio.h, math.h, string.h, etc.', 'system');
        log('Press Ctrl+Enter to compile and run your code.', 'system');
        
    } catch (error) {
        console.error('Wasmer initialization error:', error);
        compilerStatus.textContent = 'Error';
        compilerStatus.style.color = '#f85149';
        log(`Failed to initialize compiler: ${error.message}`, 'stderr');
        log('', 'system');
        log('Troubleshooting:', 'warning');
        log('1. Make sure you are using npm run dev (not opening HTML directly)', 'system');
        log('2. Check that the page reloaded to activate the service worker', 'system');
        log('3. Try refreshing the page', 'system');
    }
}

// ============================================
// CODE EXECUTION
// ============================================
async function runCode() {
    if (!wasmerInitialized || isRunning) {
        if (!wasmerInitialized) {
            log('Compiler not ready yet. Please wait...', 'warning');
        }
        return;
    }

    isRunning = true;
    setStatus('running');
    runBtn.disabled = true;

    const code = editor.getValue();
    
    log('─'.repeat(50), 'system');
    log('Compiling...', 'info');

    try {
        const { Wasmer, Directory } = WasmerSDK;
        
        // Create a virtual filesystem for the project
        const project = new Directory();
        await project.writeFile("main.c", code);

        // Get stdin if provided
        const stdin = stdinInput.value || '';

        // Compile the C code to WebAssembly
        const compileStart = performance.now();
        
        let compileInstance = await clangPackage.entrypoint.run({
            args: ["/project/main.c", "-o", "/project/main.wasm", "-lm"],
            mount: { "/project": project },
        });
        
        const compileOutput = await compileInstance.wait();
        const compileTime = (performance.now() - compileStart).toFixed(0);

        if (!compileOutput.ok) {
            log(`Compilation failed (exit code: ${compileOutput.code})`, 'stderr');
            if (compileOutput.stderr) {
                log(compileOutput.stderr, 'stderr');
            }
            setStatus('error');
            return;
        }

        if (compileOutput.stderr) {
            log('Compiler warnings:', 'warning');
            log(compileOutput.stderr, 'warning');
        }

        log(`Compiled successfully in ${compileTime}ms`, 'success');
        log('Running program...', 'info');
        log('─'.repeat(50), 'system');

        // Read the compiled WASM file
        const wasmBytes = await project.readFile("main.wasm");
        
        // Load and run the compiled program
        const program = await Wasmer.fromFile(wasmBytes);
        
        const runStart = performance.now();
        const runInstance = await program.entrypoint.run({
            stdin: stdin,
        });
        const result = await runInstance.wait();
        const runTime = (performance.now() - runStart).toFixed(0);

        // Display output
        if (result.stdout) {
            log(result.stdout, 'stdout');
        }
        if (result.stderr) {
            log(result.stderr, 'stderr');
        }

        log('─'.repeat(50), 'system');
        if (result.ok) {
            log(`Program exited with code ${result.code} (${runTime}ms)`, 'success');
            setStatus('ready');
        } else {
            log(`Program exited with code ${result.code}`, 'warning');
            setStatus('error');
        }

    } catch (error) {
        console.error('Execution error:', error);
        log(`Error: ${error.message}`, 'stderr');
        setStatus('error');
    } finally {
        isRunning = false;
        runBtn.disabled = false;
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
runBtn.addEventListener('click', runCode);

clearBtn.addEventListener('click', clearConsole);
clearOutputBtn.addEventListener('click', clearConsole);

examplesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    examplesDropdown.classList.toggle('visible');
});

document.addEventListener('click', () => {
    examplesDropdown.classList.remove('visible');
});

examplesDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
        const example = item.dataset.example;
        if (EXAMPLES[example]) {
            editor.setValue(EXAMPLES[example]);
            examplesDropdown.classList.remove('visible');
            log(`Loaded example: ${item.querySelector('.dropdown-item-title').textContent}`, 'system');
        }
    }
});

sendInputBtn.addEventListener('click', () => {
    const input = stdinInput.value;
    if (input) {
        log(`stdin: ${input}`, 'info');
    }
});

stdinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendInputBtn.click();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearConsole();
    }
});

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    try {
        progressBar.style.width = '10%';
        loadingSubtext.textContent = 'Loading Monaco Editor...';
        
        initMonaco();
        
        progressBar.style.width = '25%';
        
        await initWasmer();
        
        // Hide loading overlay
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
        
    } catch (error) {
        console.error('Initialization error:', error);
        loadingText.textContent = 'Initialization Error';
        loadingSubtext.textContent = error.message;
        compilerStatus.textContent = 'Failed';
        compilerStatus.style.color = '#f85149';
    }
}

// Start initialization
init();
