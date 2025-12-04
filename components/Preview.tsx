import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Download, Eye, Loader2, FileText, AlertCircle } from 'lucide-react';
import { compileLatexToPDF, downloadAsPDF, checkBackendHealth } from '../services/latexService';

interface PreviewProps {
  latexCode: string;
  coreInfoFilled: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ latexCode, coreInfoFilled }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

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

  const handleCopy = () => {
    if (!coreInfoFilled) {
      alert('Please fill in Full Name, Job Title, and Email before exporting your LaTeX.');
      return;
    }
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!coreInfoFilled) {
      alert('Please fill in Full Name, Job Title, and Email before generating PDF.');
      return;
    }

    if (backendAvailable === false) {
      // Fallback to manual method if backend is not available
      downloadAsPDF(latexCode);
      return;
    }

    setIsGeneratingPDF(true);
    setError(null);
    
    try {
      const pdfBlob = await compileLatexToPDF(latexCode);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('PDF generation failed:', err);
      
      // Check if it's a Docker-related error
      if (err.message && err.message.includes('Docker')) {
        setError('Docker is not running. Please start Docker Desktop to enable PDF compilation. Using manual method.');
      } else if (err.message && err.message.includes('pdflatex not found')) {
        setError('LaTeX is not installed on the backend. Please install MiKTeX, TeX Live, or MacTeX. Using manual method.');
      } else {
        setError('Backend compilation failed. Using manual method.');
      }
      
      // Fallback to manual method
      downloadAsPDF(latexCode);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreviewPDF = async () => {
    if (!coreInfoFilled) {
      alert('Please fill in Full Name, Job Title, and Email before previewing PDF.');
      return;
    }

    if (previewMode === 'preview' && pdfUrl) {
      // Switch back to code view
      setPreviewMode('code');
      return;
    }

    if (backendAvailable === false) {
      setError('Backend service not available. Please use Download PDF instead.');
      return;
    }

    setIsGeneratingPDF(true);
    setError(null);
    
    try {
      const pdfBlob = await compileLatexToPDF(latexCode);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPreviewMode('preview');
    } catch (err) {
      console.error('PDF preview failed:', err);
      
      // Check if it's a Docker-related error
      if (err.message && err.message.includes('Docker')) {
        setError('Docker is not running. Please start Docker Desktop to enable PDF preview. Using manual method.');
      } else if (err.message && err.message.includes('pdflatex not found')) {
        setError('LaTeX is not installed on the backend. Please install MiKTeX, TeX Live, or MacTeX. Using manual method.');
      } else {
        setError('Preview failed. Please try download instead.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-semibold text-slate-300">
              {previewMode === 'preview' ? 'cv.pdf' : 'main.tex'}
            </span>
            {backendAvailable === null ? (
              <Loader2 size={12} className="animate-spin text-slate-400" />
            ) : backendAvailable ? (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Backend service available" />
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full" title="Backend service unavailable" />
            )}
        </div>
        <div className="flex items-center space-x-2">
             <button
                onClick={handlePreviewPDF}
                disabled={isGeneratingPDF || !coreInfoFilled || backendAvailable === false}
                className="flex items-center px-3 py-1.5 rounded text-xs font-medium transition-all bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF && previewMode === 'code' ? (
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                ) : previewMode === 'preview' ? (
                  <FileText size={14} className="mr-1.5" />
                ) : (
                  <Eye size={14} className="mr-1.5" />
                )}
                {isGeneratingPDF && previewMode === 'code' ? 'Generating...' : previewMode === 'preview' ? 'View Code' : 'Preview PDF'}
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || !coreInfoFilled}
                className="flex items-center px-3 py-1.5 rounded text-xs font-medium transition-all bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF && previewMode === 'preview' ? (
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                ) : (
                  <Download size={14} className="mr-1.5" />
                )}
                {isGeneratingPDF && previewMode === 'preview' ? 'Generating...' : backendAvailable === false ? 'Manual Download' : 'Download PDF'}
              </button>
             <a 
                href="https://www.overleaf.com/docs" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center text-xs text-slate-400 hover:text-white transition-colors"
             >
                <ExternalLink size={14} className="mr-1" />
                Overleaf
             </a>
            <button 
                onClick={handleCopy}
                className={`flex items-center px-3 py-1.5 rounded text-xs font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-overleaf-600 hover:bg-overleaf-500 text-white'}`}
            >
                {copied ? <Check size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
      </div>
      
      {error && (
        <div className="mx-4 mt-3 mb-1 flex items-start rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {previewMode === 'preview' && pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            className="w-full h-full border-0 bg-white"
            title="PDF Preview"
          />
        ) : (
          <div className="p-4 font-mono text-xs leading-relaxed custom-scrollbar">
            <pre className="whitespace-pre-wrap break-all">
                <code className="language-tex">
                    {latexCode}
                </code>
            </pre>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 text-center">
        {previewMode === 'preview' ? (
          <span>PDF Preview - Generated from LaTeX code</span>
        ) : (
          <span>Create a new project on Overleaf and paste this code into <strong>main.tex</strong></span>
        )}
      </div>
    </div>
  );
};