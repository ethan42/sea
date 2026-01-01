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
const $ = id => document.getElementById(id);
const elements = {
    loadingOverlay: $('loading'),
    loadingText: $('loading-text'),
    loadingSubtext: $('loading-subtext'),
    progressBar: $('progress-bar'),
    consoleOutput: $('console-output'),
    statusDot: $('status-dot'),
    outputLabel: $('output-label'),
    compilerStatus: $('compiler-status-text'),
    runBtn: $('run-btn'),
    clearBtns: [ $('clear-btn'), $('clear-output-btn') ],
    examplesBtn: $('examples-btn'),
    examplesDropdown: $('examples-dropdown'),
    stdinInput: $('stdin-input'),
    sendInputBtn: $('send-input-btn')
};

// Initialize xterm.js terminal
const term = new Terminal({
    // fontFamily: 'JetBrains Mono, monospace',
    // fontSize: 14,
    theme: {
        background: '#161b22',
        foreground: '#e6edf3',
        cursor: '#58a6ff',
    },
    rows: 48,
    cols: 80,
    convertEol: true,
    scrollback: 10000,
});
term.open(elements.consoleOutput);

let isRunning = false;

// ============================================
// CONSOLE OUTPUT (xterm.js)
// ============================================
const log = (message, type = 'stdout') => {
    let color = '';
    switch (type) {
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

const clearConsole = () => { term.clear(); };

const statusLabels = { running: 'Running...', error: 'Error', default: 'Console' };
const setStatus = status => {
    elements.statusDot.className = `status-dot ${status}`;
    elements.outputLabel.textContent = statusLabels[status] || statusLabels.default;
};

// ============================================
// EVENT HANDLERS
// ============================================
const runIt = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
        await runCode(log, setStatus, elements.runBtn, elements.stdinInput);
    } finally {
        isRunning = false;
    }
};

elements.runBtn.addEventListener('click', runIt);
elements.clearBtns.forEach(btn => btn.addEventListener('click', clearConsole));

elements.examplesBtn.addEventListener('click', e => {
    e.stopPropagation();
    elements.examplesDropdown.classList.toggle('visible');
});

document.addEventListener('click', () => elements.examplesDropdown.classList.remove('visible'));

elements.examplesDropdown.addEventListener('click', e => {
    const item = e.target.closest('.dropdown-item');
    if (!item) return;
    const example = item.dataset.example;
    if (EXAMPLES[example]) {
        getEditor().setValue(EXAMPLES[example]);
        elements.examplesDropdown.classList.remove('visible');
        log(`Loaded example: ${item.querySelector('.dropdown-item-title').textContent}`, 'system');
    }
});

elements.sendInputBtn.addEventListener('click', () => {
    const input = elements.stdinInput.value;
    if (input) log(`stdin: ${input}`, 'info');
});

elements.stdinInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') elements.sendInputBtn.click();
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearConsole();
    }
});

// ============================================
// INITIALIZATION
// ============================================
(async function init() {
    try {
        elements.progressBar.style.width = '10%';
        elements.loadingSubtext.textContent = 'Loading Editor...';
        initMonaco(runIt, clearConsole);
        elements.progressBar.style.width = '25%';
        await initCompiler(log, setStatus, elements.progressBar, elements.loadingText, elements.loadingSubtext, elements.compilerStatus);
        setTimeout(() => elements.loadingOverlay.classList.add('hidden'), 500);
    } catch (error) {
        elements.loadingText.textContent = 'Initialization Error';
        elements.loadingSubtext.textContent = error.message;
        elements.compilerStatus.textContent = 'Failed';
        elements.compilerStatus.style.color = '#f85149';
    }
})();
