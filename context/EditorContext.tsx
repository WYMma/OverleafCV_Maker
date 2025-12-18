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
    cvData: CVData;
    setCvData: (data: CVData | null) => void;
    loadedCVId: string | null;
    setLoadedCVId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// helper to ensure data has all required fields and IDs
export const normalizeCVData = (newData: Partial<CVData>, currentData: CVData = INITIAL_CV_DATA): CVData => {
    return {
        ...currentData,
        ...newData,
        experience: (newData.experience || currentData.experience || []).map((e: any, i: number) => ({
            ...e,
            id: e.id || Date.now().toString() + i,
            isCurrent: e.isCurrent || false,
            employmentType: e.employmentType || 'Full-time',
            technologies: e.technologies || ''
        })),
        education: (newData.education || currentData.education || []).map((e: any, i: number) => ({
            ...e,
            id: e.id || Date.now().toString() + i + 100,
            isCurrent: e.isCurrent || false,
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            speciality: e.speciality || '',
            details: e.details || ''
        })),
        certifications: (newData.certifications || currentData.certifications || []).map((c: any, i: number) => ({
            ...c,
            id: c.id || Date.now().toString() + i + 200,
            date: c.date || '',
            details: c.details || ''
        })),
        projects: (newData.projects || currentData.projects || []).map((p: any, i: number) => ({
            ...p,
            id: p.id || Date.now().toString() + i + 300,
            technologies: p.technologies || '',
            link: p.link || ''
        })),
        extracurricularActivities: (newData.extracurricularActivities || currentData.extracurricularActivities || []).map((a: any, i: number) => ({
            ...a,
            id: a.id || Date.now().toString() + i + 400,
            isCurrent: a.isCurrent || false,
            startDate: a.startDate || '',
            endDate: a.endDate || ''
        })),
        languages: (newData.languages || currentData.languages || []).map((l: any, i: number) => ({
            ...l,
            id: l.id || Date.now().toString() + i + 500
        }))
    };
};

const CACHE_KEY = 'cv_data_cache';

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [generationJob, setGenerationJob] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateHandler, setGenerateHandler] = useState<((job: string) => Promise<void>) | null>(null);
    const [cvData, setCvDataState] = useState<CVData>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) return normalizeCVData(JSON.parse(cached));
        } catch (e) {
            console.error("Failed to load CV cache", e);
        }
        return INITIAL_CV_DATA;
    });
    const [loadedCVId, setLoadedCVId] = useState<string | null>(null);

    // Unified setter that persists
    const setCvData = useCallback((data: CVData | null) => {
        const normalized = data ? normalizeCVData(data) : INITIAL_CV_DATA;
        setCvDataState(normalized);
        localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
    }, []);

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
                setGenerationJob('');
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
