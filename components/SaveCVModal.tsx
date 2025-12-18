import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface SaveCVModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
    existingNames?: string[];
}

export const SaveCVModal: React.FC<SaveCVModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingNames = [],
}) => {
    const [cvName, setCvName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSave = async () => {
        const trimmedName = cvName.trim();

        if (!trimmedName) {
            setError('Please enter a name for your CV');
            return;
        }

        if (existingNames.includes(trimmedName)) {
            setError('A CV with this name already exists');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await onSave(trimmedName);
            setCvName('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save CV');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            setCvName('');
            setError('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">Save CV</h2>
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        CV Name
                    </label>
                    <input
                        type="text"
                        value={cvName}
                        onChange={(e) => {
                            setCvName(e.target.value);
                            setError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        placeholder="e.g., Software Engineer Resume 2024"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-overleaf-600 focus:border-transparent"
                        disabled={isSaving}
                        autoFocus
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !cvName.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-overleaf-600 hover:bg-overleaf-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save CV
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
