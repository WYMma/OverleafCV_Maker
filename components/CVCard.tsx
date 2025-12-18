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
        <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            {/* CV Icon and Name */}
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-none w-20 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group-hover:border-overleaf-300 transition-colors relative">
                    {cv.thumbnail ? (
                        <img
                            src={cv.thumbnail}
                            alt={cv.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-overleaf-50">
                            <FileText size={24} className="text-overleaf-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-1">
                    {isRenaming ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') {
                                    setIsRenaming(false);
                                    setNewName(cv.name);
                                }
                            }}
                            className="w-full px-2 py-1 text-lg font-semibold text-slate-800 border border-overleaf-600 rounded focus:outline-none focus:ring-2 focus:ring-overleaf-600"
                            autoFocus
                        />
                    ) : (
                        <h3 className="text-lg font-semibold text-slate-800 truncate">
                            {cv.name}
                        </h3>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Calendar size={12} />
                        <span>Updated {formatDate(cv.updatedAt)}</span>
                    </div>
                </div>
            </div>

            {/* CV Info */}
            <div className="mb-4 text-sm text-slate-600">
                <p className="truncate">
                    {cv.cvData.fullName || 'Untitled CV'}
                    {cv.cvData.title && ` • ${cv.cvData.title}`}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onLoad(cv)}
                    className="flex-1 bg-overleaf-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-overleaf-700 transition-colors"
                >
                    Load CV
                </button>
                <button
                    onClick={() => setIsRenaming(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Rename"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                >
                    {isDeleting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Trash2 size={18} />
                    )}
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Delete CV?
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to delete "{cv.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
