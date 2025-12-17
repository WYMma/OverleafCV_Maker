import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { CVData, INITIAL_CV_DATA } from './types';
import { generateLatex } from './utils/latexGenerator';
import { generateSampleCV } from './services/geminiService';
import { PromptInterface } from './components/PromptInterface';
import { Sparkles, FileText, Loader2, Menu, X, ArrowLeft } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

export default function App() {
  const [data, setData] = useState<CVData>(INITIAL_CV_DATA);
  const [latex, setLatex] = useState<string>("");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [generationJob, setGenerationJob] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setLatex(generateLatex(data));
  }, [data]);

  useEffect(() => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);

  const handleSmartGenerate = async () => {
    if (!generationJob.trim()) return;
    setIsGenerating(true);
    try {
      const sampleData = await generateSampleCV(generationJob);
      setData(prev => ({
        ...prev,
        ...sampleData,
        experience: sampleData.experience?.map((e: any, i: number) => ({
          ...e,
          id: Date.now().toString() + i,
          isCurrent: e.isCurrent || false,
          employmentType: e.employmentType || 'Full-time',
          technologies: e.technologies || ''
        })) || [],
        education: sampleData.education?.map((e: any, i: number) => ({
          ...e,
          id: Date.now().toString() + i + 100,
          isCurrent: e.isCurrent || false,
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          speciality: e.speciality || '',
          details: e.details || ''
        })) || [],
        certifications: sampleData.certifications?.map((c: any, i: number) => ({
          ...c,
          id: Date.now().toString() + i + 200,
          date: c.date || '',
          details: c.details || ''
        })) || [],
        projects: sampleData.projects?.map((p: any, i: number) => ({
          ...p,
          id: Date.now().toString() + i + 300,
          technologies: p.technologies || '',
          link: p.link || ''
        })) || [],
        extracurricularActivities: sampleData.extracurricularActivities?.map((a: any, i: number) => ({
          ...a,
          id: Date.now().toString() + i + 400,
          isCurrent: a.isCurrent || false,
          startDate: a.startDate || '',
          endDate: a.endDate || ''
        })) || [],
        languages: sampleData.languages?.map((l: any, i: number) => ({
          ...l,
          id: Date.now().toString() + i + 500
        })) || []
      }));
    } catch (e) {
      alert("Failed to generate CV data. Check console for details.");
    } finally {
      setIsGenerating(false);
      setGenerationJob("");
    }
  };

  const handleDataGenerated = (newData: Partial<CVData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
      experience: newData.experience?.map((e: any, i: number) => ({
        ...e,
        id: Date.now().toString() + i,
        isCurrent: e.isCurrent || false,
        employmentType: e.employmentType || 'Full-time',
        technologies: e.technologies || ''
      })) || [],
      education: newData.education?.map((e: any, i: number) => ({
        ...e,
        id: Date.now().toString() + i + 100,
        isCurrent: e.isCurrent || false,
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        speciality: e.speciality || '',
        details: e.details || ''
      })) || [],
      certifications: newData.certifications?.map((c: any, i: number) => ({
        ...c,
        id: Date.now().toString() + i + 200,
        date: c.date || '',
        details: c.details || ''
      })) || [],
      projects: newData.projects?.map((p: any, i: number) => ({
        ...p,
        id: Date.now().toString() + i + 300,
        technologies: p.technologies || '',
        link: p.link || ''
      })) || [],
      extracurricularActivities: newData.extracurricularActivities?.map((a: any, i: number) => ({
        ...a,
        id: Date.now().toString() + i + 400,
        isCurrent: a.isCurrent || false,
        startDate: a.startDate || '',
        endDate: a.endDate || ''
      })) || [],
      languages: newData.languages?.map((l: any, i: number) => ({
        ...l,
        id: Date.now().toString() + i + 500
      })) || []
    }));
    setHasInitialized(true);
  };

  const coreInfoFilled = Boolean(
    data.fullName.trim() && data.title.trim() && data.email.trim()
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex-none h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-overleaf-600 p-1.5 rounded text-white">
            <FileText size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Overleaf<span className="text-overleaf-600">CV</span></h1>
        </div>

        {hasInitialized && (
          <div className="hidden md:flex items-center space-x-3 bg-slate-50 p-1 rounded-lg border border-slate-200 absolute left-1/2 transform -translate-x-1/2">
            <input
              type="text"
              placeholder="e.g. Data Scientist, Nurse..."
              className="bg-transparent border-none outline-none text-sm px-3 w-48 text-slate-700 placeholder:text-slate-400"
              value={generationJob}
              onChange={(e) => setGenerationJob(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartGenerate()}
            />
            <button
              onClick={handleSmartGenerate}
              disabled={isGenerating || !generationJob}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2 text-yellow-400" />}
              Auto-Fill
            </button>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-overleaf-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-overleaf-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="border border-overleaf-600 text-overleaf-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-overleaf-50 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {hasInitialized && (
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
            >
              {isMobilePreviewOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Auto-Fill (only visible on small screens) - Only show when initialized */}
      {hasInitialized && (
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
              onClick={handleSmartGenerate}
              disabled={isGenerating}
              className="bg-slate-900 text-white p-2 rounded flex items-center justify-center"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>
          </div>
        </div>
      )}

      {apiKeyMissing && (
        <div className="bg-yellow-50 text-yellow-800 px-6 py-2 text-xs text-center border-b border-yellow-100">
          Note: API_KEY is missing. AI features (Auto-Fill & Polish) will not function.
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {!hasInitialized ? (
          <PromptInterface onDataGenerated={handleDataGenerated} />
        ) : (
          <>
            {/* Editor Panel */}
            <div className={`w-full md:w-1/2 lg:w-5/12 h-full overflow-y-auto ${isMobilePreviewOpen ? 'hidden' : 'block'}`}>
              <div className="p-4 border-b border-slate-200 md:hidden flex items-center">
                <button
                  onClick={() => setHasInitialized(false)}
                  className="flex items-center text-sm text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to Prompt
                </button>
              </div>
              <Editor data={data} onChange={setData} />
            </div>

            {/* Preview Panel */}
            <div className={`w-full md:w-1/2 lg:w-7/12 h-full bg-slate-900 ${isMobilePreviewOpen ? 'block' : 'hidden md:block'}`}>
              <Preview latexCode={latex} coreInfoFilled={coreInfoFilled} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}