// Editor setup for Sea
import * as monaco from 'monaco-editor';
import { EXAMPLES } from './examples.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

let editor = null;

// Configure Monaco workers for Vite - required to run compiler / other jobs in workers
self.MonacoEnvironment = {
    getWorker: function () {
        console.log('Creating editor worker');
        return new editorWorker();
    }
};

export function initMonaco(runCode, clearConsole) {
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

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        runCode();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, () => {
        clearConsole();
    });

    return editor;
}

export function getEditor() {
    return editor;
}
