import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, FolderOpen } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm font-medium">Back</span>
                            </button>
                            <div className="h-6 w-px bg-slate-300" />
                            <div className="flex items-center gap-2">
                                <FolderOpen size={24} className="text-overleaf-600" />
                                <h1 className="text-2xl font-bold text-slate-800">My Saved CVs</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/editor')}
                            className="bg-overleaf-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-overleaf-700 transition-colors flex items-center gap-2"
                        >
                            <FileText size={18} />
                            Create New CV
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-overleaf-600 mb-4" />
                        <p className="text-slate-600">Loading your CVs...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                            <p className="text-red-800 text-center">{error}</p>
                            <button
                                onClick={loadCVs}
                                className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : cvs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-slate-100 p-6 rounded-full mb-6">
                            <FileText size={48} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                            No saved CVs yet
                        </h2>
                        <p className="text-slate-600 mb-6 text-center max-w-md">
                            Start creating your first CV and save it to access it anytime.
                        </p>
                        <button
                            onClick={() => navigate('/editor')}
                            className="bg-overleaf-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-overleaf-700 transition-colors flex items-center gap-2"
                        >
                            <FileText size={20} />
                            Create Your First CV
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-slate-600">
                                {cvs.length} {cvs.length === 1 ? 'CV' : 'CVs'} saved
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cvs.map((cv) => (
                                <CVCard
                                    key={cv.id}
                                    cv={cv}
                                    onLoad={handleLoadCV}
                                    onDelete={handleDeleteCV}
                                    onRename={handleRenameCV}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
