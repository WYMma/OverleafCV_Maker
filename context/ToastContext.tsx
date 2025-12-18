import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                {toasts.map(toast => (
                    <ToastComponent key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Internal Toast Component
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastComponent: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-in fade-in slide-in-from-right-5 duration-300 ${bgColors[toast.type]} min-w-[320px] max-w-md`}>
            <div className="flex-none">
                {icons[toast.type]}
            </div>
            <div className="flex-1 text-sm font-medium text-slate-800">
                {toast.message}
            </div>
            <button
                onClick={onClose}
                className="flex-none text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
};
