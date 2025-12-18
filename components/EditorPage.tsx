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
  const {
    registerGenerateHandler,
    generationJob,
    setGenerationJob,
    isGenerating,
    triggerGenerate,
    cvData,
    setCvData,
    loadedCVId,
    setLoadedCVId
  } = useEditorContext();
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

  const [latex, setLatex] = useState<string>("");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Sync location state into context if we just arrived with new data
  useEffect(() => {
    const state = location.state as { initialData?: Partial<CVData>; fromAI?: boolean } | null;
    if (state?.initialData) {
      setCvData(state.initialData as CVData);
      window.history.replaceState({}, '');
    } else if (state?.fromAI === false) {
      setCvData(INITIAL_CV_DATA);
      setLoadedCVId(null);
      window.history.replaceState({}, '');
    }
  }, [location, setCvData, setLoadedCVId]);

  useEffect(() => {
    setLatex(generateLatex(cvData));
  }, [cvData]);

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
      setCvData(sampleData as CVData);
      setLoadedCVId(null);
    } catch (e) {
      showToast("Failed to generate CV data. Check console for details.", "error");
    }
  };

  const coreInfoFilled = Boolean(
    cvData.fullName.trim() && cvData.title.trim() && cvData.email.trim()
  );

  const handleSaveCV = async (name: string) => {
    try {
      showToast('Preparing CV for saving...', 'info');

      // Generate the PDF and Thumbnail first
      const { blob } = await compileLatexToPDF(latex, cvData.fullName);
      const thumbnailBase64 = await generateThumbnail(blob);

      if (loadedCVId) {
        // Update existing CV
        await updateCV(loadedCVId, { cvData, thumbnail: thumbnailBase64 }, getToken);
        showToast('CV updated successfully!', 'success');
      } else {
        // Save new CV
        const savedCV = await saveCV(name, cvData, getToken, thumbnailBase64);
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
      <div className="flex flex-col h-full bg-mesh selection:bg-primary-100 selection:text-primary-900">
        {/* Mobile Toolbar (Minimal Glass) */}
        <div className="md:hidden flex-none h-16 glass border-b border-white/20 flex items-center justify-between px-6 z-10 shadow-glass">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg text-white">
              <FileText size={18} />
            </div>
            <span className="font-display font-bold text-slate-800 tracking-tight">HireDocs</span>
          </div>
          <button
            className="p-2.5 text-slate-600 hover:bg-white/50 rounded-xl transition-all active:scale-95"
            onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
          >
            {isMobilePreviewOpen ? <X size={20} className="text-primary-600" /> : <Menu size={20} />}
          </button>
        </div>

        {apiKeyMissing && (
          <div className="bg-amber-500 text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-center shadow-lg z-[20]">
            Backend URL Missing | AI Features Disabled
          </div>
        )}

        {/* Mobile Auto-Fill Control */}
        {!isMobilePreviewOpen && (
          <div className="md:hidden p-4 glass mx-4 mt-4 rounded-2xl border border-white/40 shadow-glass animate-in fade-in slide-in-from-top-2">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Target Role (e.g. Data Scientist)"
                className="flex-1 px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                value={generationJob}
                onChange={(e) => setGenerationJob(e.target.value)}
              />
              <button
                onClick={triggerGenerate}
                disabled={isGenerating || !generationJob}
                className="bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-primary-400" />}
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden relative p-0 md:p-3 lg:p-4 gap-0 md:gap-4">
          {/* Editor Panel */}
          <div className={`w-full md:w-1/2 lg:w-[450px] xl:w-[500px] h-full glass md:rounded-3xl border border-white/20 shadow-glass overflow-hidden flex flex-col ${isMobilePreviewOpen ? 'hidden' : 'block animate-in fade-in slide-in-from-left-4 transition-all'}`}>
            <Editor data={cvData} onChange={setCvData} />
          </div>

          {/* Preview Panel */}
          <div className={`flex-1 h-full glass md:rounded-3xl border border-white/10 shadow-premium overflow-hidden ${isMobilePreviewOpen ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden md:block animate-in fade-in slide-in-from-right-4'}`}>
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
