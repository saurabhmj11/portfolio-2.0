import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeShowcaseProps {
    code: string;
    language: string;
    filename?: string;
}

const CodeShowcase: React.FC<CodeShowcaseProps> = ({ code, language, filename = 'terminal.sh' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-black/50 mt-8"
        >
            {/* macOS Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/50" />
                </div>
                <div className="text-xs font-mono text-gray-500 font-medium">
                    {filename}
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                    title="Copy code"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                    )}
                </button>
            </div>

            {/* Code Body */}
            <div className="relative overflow-x-auto p-4 text-[13px] sm:text-sm custom-scrollbar max-h-[500px]">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                        fontSize: 'inherit',
                        lineHeight: '1.6',
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: 'rgba(255,255,255,0.2)',
                        textAlign: 'right',
                    }}
                    wrapLines={false}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </motion.div>
    );
};

export default CodeShowcase;
