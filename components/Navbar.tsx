import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderOpen } from 'lucide-react';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton
} from '@clerk/clerk-react';
import { useEditorContext } from '../context/EditorContext';
import { Loader2, Sparkles } from 'lucide-react';


export const Navbar = () => {
    const navigate = useNavigate();

    const path = window.location.pathname;
    const isEditor = path === '/editor';
    const { generationJob, setGenerationJob, isGenerating, triggerGenerate } = useEditorContext();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            triggerGenerate();
        }
    };

    return (
        <nav className="h-16 flex-none glass border-b border-white/20 sticky top-0 z-[50] flex items-center justify-between px-6 shadow-glass">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="bg-primary-600 p-1.5 rounded-xl text-white hidden sm:flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                </div>
                <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                    Hire<span className="text-primary-600">Docs</span>
                </h1>
            </div>

            <div className="flex items-center flex-1 justify-end space-x-4">
                {/* Editor AI Control */}
                {isEditor && (
                    <div className="hidden md:flex items-center space-x-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/50 mr-4 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                        <input
                            type="text"
                            placeholder="Data Scientist, Nurse..."
                            className="bg-transparent border-none outline-none text-sm px-4 w-56 text-slate-700 placeholder:text-slate-400 font-medium"
                            value={generationJob}
                            onChange={(e) => setGenerationJob(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={triggerGenerate}
                            disabled={isGenerating || !generationJob}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                        >
                            {isGenerating ? <Loader2 size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2 text-primary-400" />}
                            Auto-Fill
                        </button>
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        {/* My CVs Button */}
                        {!isEditor && (
                            <button
                                onClick={() => navigate('/my-cvs')}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl font-semibold text-sm transition-all"
                            >
                                <FolderOpen size={18} className="text-primary-600" />
                                <span className="hidden sm:inline">Collections</span>
                            </button>
                        )}

                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};
