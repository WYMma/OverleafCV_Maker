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
        <nav className="h-16 flex-none border-b border-slate-200 bg-white flex items-center justify-between px-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-overleaf-600 p-1.5 rounded text-white hidden sm:block">
                    <FileText size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    Overleaf<span className="text-overleaf-600">CV</span>
                </h1>
            </div>

            <div className="flex items-center flex-1 justify-end space-x-4">
                {/* Editor AI Control */}
                {isEditor && (
                    <div className="hidden md:flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-slate-200 mr-4">
                        <input
                            type="text"
                            placeholder="Data Scientist, Nurse..."
                            className="bg-transparent border-none outline-none text-sm px-3 w-48 text-slate-700 placeholder:text-slate-400"
                            value={generationJob}
                            onChange={(e) => setGenerationJob(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={triggerGenerate}
                            disabled={isGenerating || !generationJob}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center hover:bg-slate-800 disabled:opacity-50 transition-all"
                        >
                            {isGenerating ? <Loader2 size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2 text-yellow-400" />}
                            Auto-Fill
                        </button>
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="bg-overleaf-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-overleaf-700 transition-colors">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        {/* My CVs Button */}
                        {!isEditor && (
                            <button
                                onClick={() => navigate('/my-cvs')}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                            >
                                <FolderOpen size={18} />
                                <span className="hidden sm:inline">My CVs</span>
                            </button>
                        )}

                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};
