import React, { useState } from 'react';
import { Loader2, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { extractCVData } from '../services/geminiService';
import { CVData } from '../types';

interface PromptInterfaceProps {
    onDataGenerated: (data: Partial<CVData>) => void;
}

export const PromptInterface: React.FC<PromptInterfaceProps> = ({ onDataGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            const data = await extractCVData(prompt);
            onDataGenerated(data);
        } catch (err) {
            setError('Failed to process your request. Please try again.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center justify-center p-4 pb-20">
            <div className="max-w-3xl w-full space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-2.5 bg-overleaf-600 rounded-lg text-white mb-2 shadow-lg shadow-overleaf-600/20">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Tell us about you
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Describe your professional background, and we'll do the heavy lifting.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="cv-prompt" className="block text-sm font-medium text-slate-700">
                            Professional Description
                        </label>
                        <div className="relative">
                            <textarea
                                id="cv-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Example: I am a software engineer with 5 years of experience in React and Node.js. I worked at Google from 2020 to 2023 as a Senior Developer... I have a degree in CS from Stanford..."
                                className="w-full h-48 p-4 text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-overleaf-500 focus:border-transparent resize-none text-base leading-relaxed shadow-inner"
                                disabled={isGenerating}
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                                {prompt.length} characters
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                            <Sparkles size={12} className="text-yellow-500" />
                            The more details you provide, the better your CV will be.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-1">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white transition-all duration-200 bg-overleaf-600 rounded-xl hover:bg-overleaf-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-overleaf-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-overleaf-600/30 hover:shadow-overleaf-600/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Analyzing Profile...
                                </>
                            ) : (
                                <>
                                    Generate Your CV
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
