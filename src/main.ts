// Sea - Main Application
import './style.css';
import { EXAMPLES } from './examples.js';
import { initMonaco, getEditor } from './editor.js';
import { initCompiler, runCode } from './env.js';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

// ============================================
// DOM ELEMENTS
// ============================================
const $ = (id: string): HTMLElement | null => document.getElementById(id);

interface Elements {
    loadingOverlay: HTMLElement;
    loadingText: HTMLElement;
    loadingSubtext: HTMLElement;
    progressBar: HTMLElement;
    consoleOutput: HTMLElement;
    statusDot: HTMLElement;
    outputLabel: HTMLElement;
    compilerStatus: HTMLElement;
    runBtn: HTMLButtonElement;
    clearBtns: (HTMLButtonElement | null)[];
    examplesBtn: HTMLButtonElement;
    examplesDialog: HTMLDialogElement;
    examplesDropdown: HTMLElement;
    closeDialogBtn: HTMLButtonElement;
    stdinInput: HTMLInputElement;
    sendInputBtn: HTMLButtonElement;
}

const elements: Elements = {
    loadingOverlay: $('loading')!,
    loadingText: $('loading-text')!,
    loadingSubtext: $('loading-subtext')!,
    progressBar: $('progress-bar')!,
    consoleOutput: $('console-output')!,
    statusDot: $('status-dot')!,
    outputLabel: $('output-label')!,
    compilerStatus: $('compiler-status-text')!,
    runBtn: $('run-btn') as HTMLButtonElement,
    clearBtns: [$('clear-btn') as HTMLButtonElement, $('clear-output-btn') as HTMLButtonElement],
    examplesBtn: $('examples-btn') as HTMLButtonElement,
    examplesDialog: $('examples-dialog') as HTMLDialogElement,
    examplesDropdown: $('examples-dropdown')!,
    closeDialogBtn: $('close-dialog-btn') as HTMLButtonElement,
    stdinInput: $('stdin-input') as HTMLInputElement,
    sendInputBtn: $('send-input-btn') as HTMLButtonElement
};

// Initialize xterm.js terminal
const term = new Terminal({
    theme: {
        background: '#161b22',
        foreground: '#e6edf3',
        cursor: '#58a6ff',
    },
    rows: 48,
    cols: 55,
    convertEol: true,
    scrollback: 10000,
});
term.open(elements.consoleOutput);

let isRunning = false;

// ============================================
// CONSOLE OUTPUT (xterm.js)
// ============================================
type LogType = 'stdout' | 'stderr' | 'info' | 'success' | 'warning' | 'system';

const log = (message: string, type?: string): void => {
    const logType = (type as LogType) || 'stdout';
    let color = '';
    switch (logType) {
        case 'stderr': color = '\x1b[31m'; break; // red
        case 'info': color = '\x1b[38;5;81m'; break; // blue
        case 'success': color = '\x1b[32m'; break; // green
        case 'warning': color = '\x1b[33m'; break; // yellow
        case 'system': color = '\x1b[38;5;245m'; break; // gray
        default: color = ''; break;
    }
    if (type === 'system') {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        term.writeln(`${color}[${timestamp}] ${message}\x1b[0m`);
    } else {
        term.writeln(`${color}${message}\x1b[0m`);
    }
};

const clearConsole = (): void => { term.clear(); };

const statusLabels: Record<string, string> = { running: 'Running...', error: 'Error', default: 'Console' };
const setStatus = (status: string): void => {
    elements.statusDot.className = `status-dot ${status}`;
    elements.outputLabel.textContent = statusLabels[status] || statusLabels.default;
};

// ============================================
// EVENT HANDLERS
// ============================================
const runIt = async (): Promise<void> => {
    if (isRunning) return;
    isRunning = true;
    try {
        clearConsole(); // Clear previous output before running new code
        await runCode(log, setStatus, elements.runBtn, elements.stdinInput);
    } finally {
        isRunning = false;
    }
};

elements.runBtn.addEventListener('click', runIt);
elements.clearBtns.forEach(btn => btn?.addEventListener('click', clearConsole));

elements.examplesBtn.addEventListener('click', () => {
    elements.examplesDialog.showModal();
});

elements.closeDialogBtn.addEventListener('click', () => {
    elements.examplesDialog.close();
});

// Close dialog when clicking outside
elements.examplesDialog.addEventListener('click', (e: MouseEvent) => {
    if (e.target === elements.examplesDialog) {
        elements.examplesDialog.close();
    }
});

// Close dialog with Escape key (native behavior, but we can add custom handling if needed)
elements.examplesDialog.addEventListener('close', () => {
    // Dialog closed
});

elements.examplesDropdown.addEventListener('click', (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest('.dropdown-item');
    if (!item) return;
    const example = item.getAttribute('data-example');
    if (example && EXAMPLES[example]) {
        getEditor().setValue(EXAMPLES[example]);
        elements.examplesDialog.close();
        const titleElement = item.querySelector('.dropdown-item-title');
        if (titleElement) {
            log(`Loaded example: ${titleElement.textContent}`, 'system');
        }
    }
});

elements.sendInputBtn.addEventListener('click', () => {
    const input = elements.stdinInput.value;
    if (input) log(`stdin: ${input}`, 'info');
});

elements.stdinInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') elements.sendInputBtn.click();
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearConsole();
    }
});

// ============================================
// INITIALIZATION
// ============================================
(async function init(): Promise<void> {
    try {
        elements.progressBar.style.width = '10%';
        elements.loadingSubtext.textContent = 'Loading Editor...';
        initMonaco(runIt, clearConsole);
        elements.progressBar.style.width = '25%';
        await initCompiler(log, setStatus, elements.progressBar, elements.loadingText, elements.loadingSubtext, elements.compilerStatus, elements.runBtn);
        setTimeout(() => elements.loadingOverlay.classList.add('hidden'), 500);
    } catch (error) {
        const err = error as Error;
        elements.loadingText.textContent = 'Initialization Error';
        elements.loadingSubtext.textContent = err.message;
        elements.compilerStatus.textContent = 'Failed';
        elements.compilerStatus.style.color = '#f85149';
    }
})();

