import React, { useState } from 'react';
import { FileText, Trash2, Edit2, Loader2, Calendar } from 'lucide-react';
import { SavedCV } from '../types';
import { useToast } from '../context/ToastContext';

interface CVCardProps {
    cv: SavedCV;
    onLoad: (cv: SavedCV) => void;
    onDelete: (id: string) => Promise<void>;
    onRename: (id: string, newName: string) => Promise<void>;
}

export const CVCard: React.FC<CVCardProps> = ({ cv, onLoad, onDelete, onRename }) => {
    const { showToast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(cv.name);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(cv.id);
            showToast('CV deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete CV:', error);
            showToast('Failed to delete CV. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleRename = async () => {
        if (newName.trim() === cv.name || !newName.trim()) {
            setIsRenaming(false);
            setNewName(cv.name);
            return;
        }

        try {
            await onRename(cv.id, newName.trim());
            setIsRenaming(false);
            showToast('CV renamed successfully', 'success');
        } catch (error) {
            console.error('Failed to rename CV:', error);
            showToast('Failed to rename CV. Please try again.', 'error');
            setNewName(cv.name);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="group glass border border-white/40 rounded-[1.5rem] p-4 hover:shadow-premium transition-all duration-500 hover:-translate-y-1 fill-mode-both flex flex-col h-full bg-white/40">
            {/* CV Thumbnail and Info */}
            <div className="flex-1 flex flex-col cursor-pointer" onClick={() => onLoad(cv)}>
                <div className="relative aspect-[4/5] mb-4 bg-white/50 rounded-xl overflow-hidden border border-white/60 shadow-inner group-hover:border-primary-200 transition-colors">
                    {cv.thumbnail ? (
                        <img
                            src={cv.thumbnail}
                            alt={cv.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50">
                            <FileText size={40} className="text-slate-200 mb-1" />
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No Preview</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">View</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-1">
                        {isRenaming ? (
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={handleRename}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename();
                                    if (e.key === 'Escape') {
                                        setIsRenaming(false);
                                        setNewName(cv.name);
                                    }
                                }}
                                className="flex-1 px-2 py-1 text-sm font-bold text-slate-900 bg-white/50 border-2 border-primary-500 rounded-lg focus:outline-none shadow-premium animate-in zoom-in-95 duration-200"
                                autoFocus
                            />
                        ) : (
                            <h3 className="text-base font-display font-bold text-slate-900 truncate tracking-tight group-hover:text-primary-600 transition-colors">
                                {cv.name}
                            </h3>
                        )}
                    </div>

                    <p className="text-[10px] font-medium text-slate-400 truncate mb-3">
                        {cv.cvData.fullName || 'Draft'}
                        {cv.cvData.title && <span className="mx-1 opacity-30">•</span>}
                        {cv.cvData.title}
                    </p>

                    <div className="flex items-center gap-1.5 mt-auto text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <div className="p-1 rounded bg-slate-50 border border-slate-100">
                            <Calendar size={8} className="text-slate-400" />
                        </div>
                        <span>Updated {formatDate(cv.updatedAt)}</span>
                    </div>
                </div>
            </div>

            {/* Actions Panel */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <button
                    onClick={(e) => { e.stopPropagation(); onLoad(cv); }}
                    className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-primary-500 transition-all shadow-md active:scale-95"
                >
                    Open
                </button>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Rename"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                        disabled={isDeleting}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                    >
                        {isDeleting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Trash2 size={14} />
                        )}
                    </button>
                </div>
            </div>

            {/* Premium Delete Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300 px-4">
                    <div
                        className="bg-white rounded-[2.5rem] shadow-premium p-8 max-w-sm w-full animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 text-center">
                            Delete Document?
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mb-8 text-center leading-relaxed">
                            This will permanently remove <span className="text-slate-900 font-bold">"{cv.name}"</span> from your collections. This action is irreversible.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleDelete()}
                                disabled={isDeleting}
                                className="w-full py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isDeleting ? 'Erasing...' : 'Confirm Deletion'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
                            >
                                Keep Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
