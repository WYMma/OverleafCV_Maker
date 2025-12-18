// LaTeX compilation service using backend server
export const compileLatexToPDF = async (latexCode: string, fullName?: string): Promise<{ blob: Blob, filename: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latexCode: latexCode,
        fullName: fullName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to compile LaTeX');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Compilation failed');
    }

    // Convert base64 PDF back to blob
    const pdfBytes = atob(result.pdf);
    const pdfArray = new Uint8Array(pdfBytes.length);
    for (let i = 0; i < pdfBytes.length; i++) {
      pdfArray[i] = pdfBytes.charCodeAt(i);
    }

    const blob = new Blob([pdfArray], { type: 'application/pdf' });
    const filename = result.filename || 'cv.pdf';

    return { blob, filename };
  } catch (error) {
    console.error('Backend compilation failed:', error);
    throw error;
  }
};

// Check if backend server is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Alternative using Overleaf's public API (requires API key)
export const compileWithOverleaf = async (latexCode: string, apiKey?: string): Promise<Blob> => {
  if (!apiKey) {
    throw new Error('Overleaf API key is required');
  }

  const response = await fetch('https://api.overleaf.com/v1/compile', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: latexCode,
      compiler: 'pdflatex'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to compile with Overleaf');
  }

  return response.blob();
};

// Simple PDF generation using browser's print functionality as fallback
export const downloadAsPDF = (latexCode: string, filename: string = 'cv.pdf') => {
  // Create a temporary textarea with the LaTeX code
  const textarea = document.createElement('textarea');
  textarea.value = latexCode;
  document.body.appendChild(textarea);
  textarea.select();

  // Copy to clipboard
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Open Overleaf in new tab
  window.open('https://www.overleaf.com/docs', '_blank');

  return true; // Return success status
};
