import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, ArrowRight, PenTool } from 'lucide-react';
import { PromptInterface } from './PromptInterface';
import { CVData } from '../types';

export default function SelectionPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'selection' | 'prompt'>('selection');

    const handleDataGenerated = (data: Partial<CVData>) => {
        // Navigate to editor with the generated data
        navigate('/editor', { state: { initialData: data, fromAI: true } });
    };

    const handleManualStart = () => {
        // Navigate to editor with empty/default data
        navigate('/editor', { state: { fromAI: false } });
    };

    if (mode === 'prompt') {
        return (
            <>
                <button
                    onClick={() => setMode('selection')}
                    className="fixed top-20 left-4 z-40 text-slate-500 hover:text-slate-800 text-sm font-medium bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200"
                >
                    ← Back to Selection
                </button>
                <PromptInterface onDataGenerated={handleDataGenerated} />
            </>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-4 pb-20">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center p-3 bg-overleaf-600 rounded-lg text-white mb-2 shadow-lg shadow-overleaf-600/20">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Choose Your Path
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        How would you like to create your CV today?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* AI Option */}
                    <button
                        onClick={() => setMode('prompt')}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 hover:border-overleaf-500 hover:shadow-2xl transition-all group text-left space-y-3 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles size={80} className="text-overleaf-600" />
                        </div>
                        <div className="bg-overleaf-100 w-12 h-12 rounded-xl flex items-center justify-center">
                            <Sparkles className="text-overleaf-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Start with AI</h3>
                            <p className="text-slate-600 text-sm">
                                Describe your experience and let our AI extract and format your CV automatically.
                            </p>
                        </div>
                        <div className="pt-2 flex items-center text-overleaf-600 font-semibold text-sm">
                            Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Manual Option */}
                    <button
                        onClick={handleManualStart}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all group text-left space-y-3 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PenTool size={80} className="text-slate-600" />
                        </div>
                        <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center">
                            <PenTool className="text-slate-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Start Manually</h3>
                            <p className="text-slate-600 text-sm">
                                Start with a clean slate and fill in your details manually using our structured editor.
                            </p>
                        </div>
                        <div className="pt-2 flex items-center text-slate-600 font-semibold text-sm">
                            Go to Editor <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
