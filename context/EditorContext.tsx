import React, { createContext, useContext, useState, useCallback } from 'react';
import { CVData, INITIAL_CV_DATA } from '../types';

interface EditorContextType {
    generationJob: string;
    setGenerationJob: (job: string) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
    // We use a registry pattern so EditorPage can register its handler
    registerGenerateHandler: (handler: (job: string) => Promise<void>) => void;
    triggerGenerate: () => void;
    // CV data management
    cvData: CVData | null;
    setCvData: (data: CVData | null) => void;
    loadedCVId: string | null;
    setLoadedCVId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [generationJob, setGenerationJob] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateHandler, setGenerateHandler] = useState<((job: string) => Promise<void>) | null>(null);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loadedCVId, setLoadedCVId] = useState<string | null>(null);

    const registerGenerateHandler = useCallback((handler: (job: string) => Promise<void>) => {
        setGenerateHandler(() => handler);
    }, []);

    const triggerGenerate = useCallback(async () => {
        if (generateHandler && generationJob.trim()) {
            setIsGenerating(true);
            try {
                await generateHandler(generationJob);
            } finally {
                setIsGenerating(false);
                setGenerationJob(''); // Clear after generation? optional
            }
        }
    }, [generateHandler, generationJob]);

    return (
        <EditorContext.Provider value={{
            generationJob,
            setGenerationJob,
            isGenerating,
            setIsGenerating,
            registerGenerateHandler,
            triggerGenerate,
            cvData,
            setCvData,
            loadedCVId,
            setLoadedCVId
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within an EditorProvider');
    }
    return context;
};
