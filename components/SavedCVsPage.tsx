import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, FolderOpen, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { SavedCV } from '../types';
import { getUserCVs, deleteCV, updateCV } from '../services/cvService';
import { CVCard } from './CVCard';
import { useToast } from '../context/ToastContext';

interface SavedCVsPageProps {
    onLoadCV: (cv: SavedCV) => void;
}

export const SavedCVsPage: React.FC<SavedCVsPageProps> = ({ onLoadCV }) => {
    const { showToast } = useToast();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [cvs, setCvs] = useState<SavedCV[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCVs();
    }, []);

    const loadCVs = async () => {
        setIsLoading(true);
        setError('');
        try {
            const fetchedCVs = await getUserCVs(getToken);
            setCvs(fetchedCVs);
        } catch (err: any) {
            console.error('Failed to load CVs:', err);
            const message = err.message || 'Failed to load CVs';
            setError(message);
            showToast(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadCV = (cv: SavedCV) => {
        onLoadCV(cv);
        navigate('/editor');
    };

    const handleDeleteCV = async (id: string) => {
        await deleteCV(id, getToken);
        setCvs(cvs.filter((cv) => cv.id !== id));
    };

    const handleRenameCV = async (id: string, newName: string) => {
        const updatedCV = await updateCV(id, { name: newName }, getToken);
        setCvs(cvs.map((cv) => (cv.id === id ? updatedCV : cv)));
    };

    return (
        <div className="min-h-screen bg-mesh selection:bg-primary-100 selection:text-primary-900">
            {/* Header */}
            <header className="glass border-b border-white/20 sticky top-0 z-20 shadow-glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate('/')}
                                className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-all"
                            >
                                <div className="p-2 rounded-xl group-hover:bg-primary-50 transition-colors">
                                    <ArrowLeft size={20} />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Portal</span>
                            </button>
                            <div className="h-8 w-px bg-slate-200/50" />
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/20">
                                    <FolderOpen size={24} />
                                </div>
                                <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Your Collections</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/editor')}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95"
                        >
                            <Plus size={18} className="text-primary-400" />
                            <span className="hidden sm:inline">New Resume</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse" />
                            <Loader2 size={48} className="animate-spin text-primary-600 relative z-10" />
                        </div>
                        <p className="mt-6 text-slate-500 font-medium tracking-wide">Syncing your documents...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-top-4">
                        <div className="glass border-red-200/50 rounded-3xl p-8 max-w-md shadow-2xl">
                            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Sync Error</h3>
                            <p className="text-slate-500 text-center mb-8 leading-relaxed">{error}</p>
                            <button
                                onClick={loadCVs}
                                className="w-full bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                Try to Reconnect
                            </button>
                        </div>
                    </div>
                ) : cvs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary-100 blur-3xl rounded-full opacity-50" />
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium relative z-10 border border-slate-100 transform -rotate-6">
                                <FileText size={64} className="text-slate-300" />
                                <div className="absolute -bottom-2 -right-2 bg-primary-500 p-3 rounded-2xl shadow-lg text-white transform rotate-12">
                                    <Plus size={24} />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                            Your shelf is empty
                        </h2>
                        <p className="text-slate-500 mb-10 text-center max-w-md leading-relaxed font-medium">
                            Ready to land that dream job? Create your first professional resume in minutes with our AI assistant.
                        </p>
                        <button
                            onClick={() => navigate('/editor')}
                            className="bg-primary-600 text-white px-8 py-4 rounded-[1.25rem] font-bold hover:bg-primary-500 transition-all flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 group"
                        >
                            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            Start Building Now
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                                    <span className="text-sm font-bold text-slate-900">
                                        {cvs.length}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    {cvs.length === 1 ? 'Document' : 'Documents'}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {cvs.map((cv, index) => (
                                <div
                                    key={cv.id}
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CVCard
                                        cv={cv}
                                        onLoad={handleLoadCV}
                                        onDelete={handleDeleteCV}
                                        onRename={handleRenameCV}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
