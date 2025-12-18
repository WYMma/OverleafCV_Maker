import React, { useState, useEffect } from 'react';
import { Copy, Check, Eye, Loader2, FileText, AlertCircle, Save, Sparkles, Download } from 'lucide-react';
import { compileLatexToPDF, checkBackendHealth } from '../services/latexService';
import { SignedIn } from '@clerk/clerk-react';
import { useToast } from '../context/ToastContext';
import { useEditorContext } from '../context/EditorContext';

interface PreviewProps {
  latexCode: string;
  coreInfoFilled: boolean;
  onSaveCV?: () => void;
}

export const Preview: React.FC<PreviewProps> = ({ latexCode, coreInfoFilled, onSaveCV }) => {
  const { showToast } = useToast();
  const { loadedCVId } = useEditorContext();
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  // Cache for generated PDFs
  const [pdfCache, setPdfCache] = useState<Map<string, { url: string, filename: string }>>(new Map());
  const [lastLatexCode, setLastLatexCode] = useState<string>('');
  const [currentFilename, setCurrentFilename] = useState<string>('cv.pdf');

  // Extract full name from LaTeX code
  const extractFullName = (latex: string): string => {
    const nameMatch = latex.match(/\\name\{([^}]+)\}\{([^}]+)\}/);
    if (nameMatch) {
      const [_, firstName, lastName] = nameMatch;
      return `${firstName.trim()} ${lastName.trim()}`;
    }
    return 'CV';
  };

  // Check backend health on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isAvailable = await checkBackendHealth();
        setBackendAvailable(isAvailable);
        if (!isAvailable) {
          setError('Backend LaTeX service is not running. Please start the backend server.');
        }
      } catch (err) {
        setBackendAvailable(false);
        setError('Unable to connect to backend service. Using manual method.');
      }
    };

    checkBackend();
  }, []);

  // Clear cache when LaTeX code changes
  useEffect(() => {
    if (latexCode !== lastLatexCode) {
      // Clear current PDF if code changed
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setPreviewMode('code');
      setLastLatexCode(latexCode);
    }
  }, [latexCode, lastLatexCode, pdfUrl]);

  // Cleanup cached URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all cached PDF URLs to prevent memory leaks
      pdfCache.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [pdfCache]);

  const handleCopy = () => {
    if (!coreInfoFilled) {
      showToast('Please fill in Full Name, Job Title, and Email before exporting your LaTeX.', 'error');
      return;
    }
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handlePreviewPDF = async () => {
    if (!coreInfoFilled) {
      showToast('Please fill in Full Name, Job Title, and Email before previewing PDF.', 'error');
      return;
    }

    if (previewMode === 'preview' && pdfUrl) {
      // Switch back to code view
      setPreviewMode('code');
      return;
    }

    if (backendAvailable === false) {
      setError('Backend service not available. Please try again later.');
      return;
    }

    // Check if PDF is already cached for this LaTeX code
    const cachedPdf = pdfCache.get(latexCode);
    if (cachedPdf) {
      setPdfUrl(cachedPdf.url);
      setCurrentFilename(cachedPdf.filename);
      setPreviewMode('preview');
      return;
    }

    setIsGeneratingPDF(true);
    setError(null);

    try {
      const fullName = extractFullName(latexCode);
      const { blob, filename } = await compileLatexToPDF(latexCode, fullName);
      const url = URL.createObjectURL(blob);

      // Cache the PDF URL and filename for this LaTeX code
      setPdfCache(prev => new Map(prev).set(latexCode, { url, filename }));
      setPdfUrl(url);
      setCurrentFilename(filename);
      setPreviewMode('preview');
    } catch (err) {
      console.error('PDF preview failed:', err);

      // Check if it's a Docker-related error
      if (err.message && err.message.includes('Docker')) {
        setError('LaTeX compilation service is not available. Please try again later.');
      } else if (err.message && err.message.includes('pdflatex not found')) {
        setError('LaTeX is not installed on the backend. Please contact administrator.');
      } else {
        setError('Preview failed. Please try again.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = currentFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CV downloaded successfully!', 'success');
  };

  return (
    <div className="h-full flex flex-col bg-black/60 backdrop-blur-2xl text-slate-100">
      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-700/50 rounded-xl shadow-inner shadow-black/20">
            <FileText size={18} className="text-primary-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-slate-200 tracking-tight">
              {previewMode === 'preview' ? currentFilename : 'source.tex'}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              {backendAvailable === null ? (
                <Loader2 size={10} className="animate-spin text-slate-500" />
              ) : backendAvailable ? (
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              ) : (
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                {backendAvailable ? 'Service Active' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {onSaveCV && (
            <SignedIn>
              <button
                onClick={onSaveCV}
                className="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/10 active:scale-95 border border-primary-400/20"
              >
                <Save size={16} className="mr-2" />
                {loadedCVId ? 'Update' : 'Save'}
              </button>
            </SignedIn>
          )}
          {previewMode === 'preview' && pdfUrl && (
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-slate-700/80 hover:bg-slate-600 text-white border border-white/10 shadow-lg active:scale-95 group"
              title="Download PDF"
            >
              <Download size={16} className="mr-2 text-primary-400 group-hover:translate-y-0.5 transition-transform" />
              Download
            </button>
          )}
          <button
            onClick={handlePreviewPDF}
            disabled={isGeneratingPDF || !coreInfoFilled || backendAvailable === false}
            className="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isGeneratingPDF && previewMode === 'code' ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : previewMode === 'preview' ? (
              <Eye size={16} className="mr-2 text-primary-400" />
            ) : (
              <Sparkles size={16} className="mr-2 text-primary-400 group-hover:scale-110 transition-transform" />
            )}
            {isGeneratingPDF && previewMode === 'code' ? 'Building...' : previewMode === 'preview' ? 'Edit Source' : 'Generate PDF'}
          </button>
          <button
            onClick={handleCopy}
            className={`p-2.5 rounded-xl transition-all shadow-lg active:scale-95 border ${copied ? 'bg-primary-600 border-primary-500' : 'bg-slate-700/50 hover:bg-slate-600/50 border-white/5'}`}
            title="Copy LaTeX"
          >
            {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-slate-300" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 flex items-start rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 shadow-xl animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={16} className="mr-3 mt-0.5 text-amber-400" />
          <span className="leading-relaxed font-semibold">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

        {previewMode === 'preview' && pdfUrl ? (
          <div className="h-full w-full bg-slate-900 p-4">
            <iframe
              src={`${pdfUrl}#toolbar=0&view=Fit`}
              className="w-full h-full border-0 bg-transparent rounded-2xl shadow-2xl"
              title="PDF Preview"
            />
          </div>
        ) : (
          <div className="h-full overflow-auto p-6 font-mono text-[12.5px] leading-tight selection:bg-primary-500/40 bg-black/40">
            <pre className="whitespace-pre-wrap break-all">
              <code className="language-tex">
                {latexCode.split('\n').map((line, i) => (
                  <div key={i} className="group flex py-0.5">
                    <span className="w-10 inline-block text-slate-600 text-right pr-6 select-none group-hover:text-slate-400 transition-colors border-r border-white/5 mr-4">{(i + 1).toString().padStart(2, ' ')}</span>
                    <span className={`${line.trim().startsWith('%') ? 'text-slate-500 italic font-light' : line.trim().startsWith('\\') ? 'text-primary-300 font-semibold' : 'text-slate-100'}`}>{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-slate-900/60 backdrop-blur-md border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex justify-between items-center">
        <span>Ready to Export</span>
        <div className="flex items-center space-x-4">
          <span className="hover:text-primary-400 transition-colors cursor-help">LaTeX 2e</span>
          <span className="hover:text-primary-400 transition-colors cursor-help">V8 Engine</span>
        </div>
      </div>
    </div>
  );
};