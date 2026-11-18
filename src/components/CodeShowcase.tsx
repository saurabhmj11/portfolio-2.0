import React, { useEffect, useRef, useState } from 'react';
// PrismLight + explicit grammars: the full `Prism` build registers ~270
// languages and made the case-study chunk ~640 KB. Register only what the
// project data uses (add a line here if a new snippet needs another language).
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import { Check, Copy, X } from 'lucide-react';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);

interface CodeShowcaseProps {
    code: string;
    language: string;
    filename?: string;
}

const DEFAULT_FILENAMES: Record<string, string> = {
    python: 'main.py',
    typescript: 'index.ts',
    tsx: 'App.tsx',
    javascript: 'index.js',
    bash: 'run.sh',
};

type CopyState = 'idle' | 'copied' | 'failed';

const CodeShowcase: React.FC<CodeShowcaseProps> = ({ code, language, filename }) => {
    const [copyState, setCopyState] = useState<CopyState>('idle');
    const resetTimer = useRef<number>();

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const handleCopy = async () => {
        let next: CopyState;
        try {
            await navigator.clipboard.writeText(code.trim());
            next = 'copied';
        } catch {
            // Insecure context or permission denied — say so instead of pretending.
            next = 'failed';
        }
        // Clear first so a repeat copy within 2s is announced again by the live region.
        setCopyState('idle');
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => {
            setCopyState(next);
            resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2000);
        }, 50);
    };

    const name = filename ?? DEFAULT_FILENAMES[language] ?? 'snippet';
    const status = copyState === 'copied' ? 'Copied to clipboard' : copyState === 'failed' ? 'Copy failed' : '';

    return (
        <figure className="w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-black/50">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
                <div className="flex items-center space-x-2" aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <figcaption className="text-xs font-mono text-gray-400">{name}</figcaption>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={`Copy ${name}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                >
                    {copyState === 'copied' ? (
                        <Check className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
                    ) : copyState === 'failed' ? (
                        <X className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" aria-hidden="true" />
                    )}
                </button>
                <span className="sr-only" role="status" aria-live="polite">{status}</span>
            </div>

            {/* Code */}
            <div
                tabIndex={0}
                role="region"
                aria-label={`${name} source code`}
                className="relative overflow-x-auto p-4 text-[13px] sm:text-sm custom-scrollbar max-h-[500px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-300"
            >
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: 'inherit', lineHeight: '1.6' }}
                    showLineNumbers
                    lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}
                    wrapLines={false}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </figure>
    );
};

export default CodeShowcase;
