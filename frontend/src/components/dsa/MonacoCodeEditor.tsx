import { memo } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoCodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    height?: string;
}

// Map our language IDs to Monaco language IDs
const MONACO_LANGUAGES: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
};

function MonacoCodeEditorInner({ value, onChange, language, height = '100%' }: MonacoCodeEditorProps) {
    const monacoLang = MONACO_LANGUAGES[language] || 'javascript';

    return (
        <Editor
            height={height}
            language={monacoLang}
            value={value}
            onChange={(val) => onChange(val || '')}
            theme="vs-dark"
            options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                },
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoIndent: 'full',
                formatOnPaste: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                contextmenu: true,
                folding: true,
                foldingHighlight: true,
            }}
            loading={
                <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                    <div className="flex items-center gap-3 text-white/50">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                        <span className="text-sm">Loading editor...</span>
                    </div>
                </div>
            }
        />
    );
}

export const MonacoCodeEditor = memo(MonacoCodeEditorInner);
