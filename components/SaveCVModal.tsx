import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles, AlertCircle, FileText } from 'lucide-react';

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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isMounted) return null;

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
        <div
            className={`fixed inset-0 flex items-center justify-center z-[100] transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div
                className={`relative w-full max-w-md mx-4 bg-slate-900/80 border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                {/* Accent Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px]" />

                {/* Header */}
                <div className="relative flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-500/20 rounded-xl">
                            <Save size={20} className="text-primary-400" />
                        </div>
                        <h2 className="text-lg font-display font-bold text-white tracking-tight">Save Your Design</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-30"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative p-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                CV Document Name
                            </label>
                            {cvName && !error && (
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest flex items-center">
                                    <Sparkles size={10} className="mr-1" /> Ready
                                </span>
                            )}
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <FileText size={18} className={`transition-colors ${cvName ? 'text-primary-400' : 'text-slate-500'}`} />
                            </div>
                            <input
                                type="text"
                                value={cvName}
                                onChange={(e) => {
                                    setCvName(e.target.value);
                                    setError('');
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                placeholder="e.g. Senior Software Engineer 2024"
                                className={`w-full pl-12 pr-4 py-4 bg-black/40 border rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 font-medium ${error
                                        ? 'border-red-500/50 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 group-hover:border-white/20'
                                    }`}
                                disabled={isSaving}
                                autoFocus
                            />
                        </div>
                        {error && (
                            <div className="mt-3 flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={14} className="text-red-400 mr-2 shrink-0" />
                                <span className="text-xs font-semibold text-red-300">{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                            Your CV will be saved to your dashboard. You can continue editing or download the generated PDF anytime.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative flex items-center justify-end gap-4 p-6 border-t border-white/5 bg-black/20">
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="px-6 py-3 text-xs font-bold text-slate-300 hover:text-white transition-colors disabled:opacity-30"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !cvName.trim()}
                        className="group relative overflow-hidden flex items-center px-8 py-3 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 border border-white/10"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                                Confirm & Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
