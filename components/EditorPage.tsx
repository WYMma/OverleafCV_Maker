import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { CVData, INITIAL_CV_DATA } from '../types';
import { generateLatex } from '../utils/latexGenerator';
import { generateSampleCV } from '../services/geminiService';
import { Sparkles, FileText, Loader2, Menu, X, ArrowLeft } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { useEditorContext } from '../context/EditorContext';
import { SaveCVModal } from './SaveCVModal';
import { saveCV, getUserCVs, updateCV } from '../services/cvService';
import { useToast } from '../context/ToastContext';
import { generateThumbnail } from '../utils/thumbnailUtils';
import { compileLatexToPDF } from '../services/latexService';

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const { registerGenerateHandler, generationJob, setGenerationJob, isGenerating, triggerGenerate, cvData, setCvData, loadedCVId, setLoadedCVId } = useEditorContext();
  const { showToast } = useToast();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [existingCVNames, setExistingCVNames] = useState<string[]>([]);

  useEffect(() => {
    registerGenerateHandler(handleSmartGenerate);
  }, [registerGenerateHandler]);

  // Load existing CV names for validation
  useEffect(() => {
    const loadCVNames = async () => {
      try {
        const cvs = await getUserCVs(getToken);
        setExistingCVNames(cvs.map(cv => cv.name));
      } catch (error) {
        console.error('Failed to load CV names:', error);
      }
    };
    loadCVNames();
  }, []);

  // Normalize data helper
  const normalizeData = (newData: Partial<CVData>, currentData: CVData = INITIAL_CV_DATA): CVData => {
    return {
      ...currentData,
      ...newData,
      experience: newData.experience?.map((e: any, i: number) => ({
        ...e,
        id: e.id || Date.now().toString() + i,
        isCurrent: e.isCurrent || false,
        employmentType: e.employmentType || 'Full-time',
        technologies: e.technologies || ''
      })) || currentData.experience || [],
      education: newData.education?.map((e: any, i: number) => ({
        ...e,
        id: e.id || Date.now().toString() + i + 100,
        isCurrent: e.isCurrent || false,
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        speciality: e.speciality || '',
        details: e.details || ''
      })) || currentData.education || [],
      certifications: newData.certifications?.map((c: any, i: number) => ({
        ...c,
        id: c.id || Date.now().toString() + i + 200,
        date: c.date || '',
        details: c.details || ''
      })) || currentData.certifications || [],
      projects: newData.projects?.map((p: any, i: number) => ({
        ...p,
        id: p.id || Date.now().toString() + i + 300,
        technologies: p.technologies || '',
        link: p.link || ''
      })) || currentData.projects || [],
      extracurricularActivities: newData.extracurricularActivities?.map((a: any, i: number) => ({
        ...a,
        id: a.id || Date.now().toString() + i + 400,
        isCurrent: a.isCurrent || false,
        startDate: a.startDate || '',
        endDate: a.endDate || ''
      })) || currentData.extracurricularActivities || [],
      languages: newData.languages?.map((l: any, i: number) => ({
        ...l,
        id: l.id || Date.now().toString() + i + 500
      })) || currentData.languages || []
    };
  };

  const CACHE_KEY = 'cv_data_cache';

  const [data, setData] = useState<CVData>(() => {
    // 1. Check if specific initial data was passed (New Session)
    const state = location.state as { initialData?: Partial<CVData>; fromAI?: boolean } | null;

    if (state?.initialData) {
      return normalizeData(state.initialData, INITIAL_CV_DATA);
    }
    if (state?.fromAI === false) {
      // Manual start -> Force clean slate
      return INITIAL_CV_DATA;
    }

    // 2. Try to load from cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Failed to load CV cache", e);
    }

    // 3. Fallback
    return INITIAL_CV_DATA;
  });

  // Save to cache whenever data changes
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, 500); // Debounce slightly
    return () => clearTimeout(handler);
  }, [data]);

  const [latex, setLatex] = useState<string>("");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Note: We removed the useEffect that listened to location.state because we now handle it in initial state
  // But if the user navigates *to* this page again without unmounting, we might need to reset.
  // However, React Router usually remounts component on route change unless preserved.
  // For safety, let's keep a listener for location.state if it changes *while* mounted (rare but possible with some nav logic)
  useEffect(() => {
    const state = location.state as { initialData?: Partial<CVData>; fromAI?: boolean } | null;
    if (state?.initialData) {
      setData(normalizeData(state.initialData, INITIAL_CV_DATA));
      // Clear state to prevent loop if we refresh? 
      // actually window.history.replaceState would be better done once.
      window.history.replaceState({}, '');
    } else if (state?.fromAI === false) {
      setData(INITIAL_CV_DATA);
      setLoadedCVId(null); // Reset ID on manual start
      window.history.replaceState({}, '');
    }
  }, [location, setLoadedCVId]);

  // ... rest of useEffects ...

  useEffect(() => {
    setLatex(generateLatex(data));
  }, [data]);

  useEffect(() => {
    if (!import.meta.env.VITE_BACKEND_URL) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);

  const handleSmartGenerate = async (jobDescription: string) => {
    try {
      const sampleData = await generateSampleCV(jobDescription);
      handleDataGenerated(sampleData);
    } catch (e) {
      showToast("Failed to generate CV data. Check console for details.", "error");
    }
  };

  const handleDataGenerated = (newData: Partial<CVData>) => {
    setData(prev => normalizeData(newData, prev));
    setLoadedCVId(null); // Reset ID on AI generation
  };

  const coreInfoFilled = Boolean(
    data.fullName.trim() && data.title.trim() && data.email.trim()
  );

  const handleSaveCV = async (name: string) => {
    try {
      showToast('Preparing CV for saving...', 'info');

      // Generate the PDF and Thumbnail first
      const { blob } = await compileLatexToPDF(latex, data.fullName);
      const thumbnailBase64 = await generateThumbnail(blob);

      if (loadedCVId) {
        // Update existing CV
        await updateCV(loadedCVId, { cvData: data, thumbnail: thumbnailBase64 }, getToken);
        showToast('CV updated successfully!', 'success');
      } else {
        // Save new CV
        const savedCV = await saveCV(name, data, getToken, thumbnailBase64);
        setLoadedCVId(savedCV.id);
        showToast('CV saved successfully!', 'success');
      }

      // Refresh CV names list
      const cvs = await getUserCVs(getToken);
      setExistingCVNames(cvs.map(cv => cv.name));
    } catch (error: any) {
      console.error('Failed to save CV:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Mobile Toolbar (Minimal) */}
        <div className="md:hidden flex-none h-14 border-b border-slate-200 bg-white flex items-center justify-end px-4 z-10 shadow-sm">
          <button
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
          >
            {isMobilePreviewOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {apiKeyMissing && (
          <div className="bg-yellow-50 text-yellow-800 px-6 py-2 text-xs text-center border-b border-yellow-100">
            Note: Backend URL is missing. AI features (Auto-Fill & Polish) will not function.
          </div>
        )}

        {/* Mobile Auto-Fill (only visible on small screens) */}
        <div className="md:hidden p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Job Title (e.g. Marketing Manager)"
              className="flex-1 p-2 text-sm border border-slate-300 rounded"
              value={generationJob}
              onChange={(e) => setGenerationJob(e.target.value)}
            />
            <button
              onClick={triggerGenerate}
              disabled={isGenerating}
              className="bg-slate-900 text-white p-2 rounded flex items-center justify-center"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>
          </div>
        </div>

        {apiKeyMissing && (
          <div className="bg-yellow-50 text-yellow-800 px-6 py-2 text-xs text-center border-b border-yellow-100">
            Note: Backend URL is missing. AI features (Auto-Fill & Polish) will not function.
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Editor Panel */}
          <div className={`w-full md:w-1/2 lg:w-5/12 h-full overflow-y-auto ${isMobilePreviewOpen ? 'hidden' : 'block'}`}>
            <Editor data={data} onChange={setData} />
          </div>

          <div className={`w-full md:w-1/2 lg:w-7/12 h-full bg-slate-900 ${isMobilePreviewOpen ? 'block' : 'hidden md:block'}`}>
            <Preview
              latexCode={latex}
              coreInfoFilled={coreInfoFilled}
              onSaveCV={() => {
                if (loadedCVId) {
                  handleSaveCV(''); // Update directly
                } else {
                  setIsSaveModalOpen(true); // Prompt for name
                }
              }}
            />
          </div>
        </main>
      </div>

      {/* Save CV Modal */}
      <SaveCVModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveCV}
        existingNames={existingCVNames}
      />
    </>
  );
}
