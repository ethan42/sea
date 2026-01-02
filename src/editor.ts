// Editor setup for Sea
import * as monaco from 'monaco-editor';
import { EXAMPLES } from './examples.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// Helper to get ?code param from URL
function getCodeFromQuery(): string | null {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (!codeParam) return null;
    try {
        // decodeURIComponent in case of URL encoding
        return atob(decodeURIComponent(codeParam));
    } catch (e) {
        return null;
    }
}

// Helper to set ?code param in URL (without reloading)
function setCodeInQuery(code: string): void {
    const params = new URLSearchParams(window.location.search);
    if (code) {
        params.set('code', encodeURIComponent(btoa(code)));
    } else {
        params.delete('code');
    }
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', newUrl);
}

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// Configure Monaco workers for Vite - required to run compiler / other jobs in workers
(self as any).MonacoEnvironment = {
    getWorker: function () {
        return new editorWorker();
    }
};


export function initMonaco(runCode: () => void, clearConsole: () => void): void {
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

    // Use code from ?code param if present, else default
    const initialCode = getCodeFromQuery() ?? EXAMPLES.hello;

    const editorContainer = document.getElementById('editor-container');
    if (!editorContainer) {
        throw new Error('Editor container not found');
    }

    // Responsive font size based on screen width
    const getFontSize = (): number => {
        const width = window.innerWidth;
        if (width <= 360) return 10;
        if (width <= 480) return 11;
        if (width <= 768) return 12;
        return 14;
    };

    // Responsive word wrap column based on screen width
    const getWordWrapColumn = (): number => {
        const width = window.innerWidth;
        if (width <= 480) return 50;
        if (width <= 768) return 55;
        return 80;
    };

    editor = monaco.editor.create(editorContainer, {
        value: initialCode,
        language: 'c',
        theme: 'sea-dark',
        fontSize: getFontSize(),
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: getWordWrapColumn(),
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        padding: { top: 12, bottom: 12 },
    });

    // Update font size on window resize
    const updateFontSize = () => {
        if (editor) {
            editor.updateOptions({ fontSize: getFontSize() });
        }
    };
    window.addEventListener('resize', updateFontSize);

    // Update ?code param on every change
    editor.onDidChangeModelContent(() => {
        if (editor) {
            setCodeInQuery(editor.getValue());
        }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        runCode();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, () => {
        clearConsole();
    });

    return;
}

export function getEditor(): monaco.editor.IStandaloneCodeEditor {
    if (!editor) {
        throw new Error('Editor not initialized');
    }
    return editor;
}

