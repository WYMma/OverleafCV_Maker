import { CVData } from "../types";

// Hardcoded for debugging
const BACKEND_URL = 'http://localhost:3001';
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const improveText = async (text: string, context: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, context }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to enhance text');
    }

    const result = await response.json();
    return result.data.enhancedText;
  } catch (error) {
    console.error("Backend enhance API Error:", error);
    throw error;
  }
};

export const generateSampleCV = async (jobTitle: string): Promise<Partial<CVData>> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate CV data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Backend API Error:", error);
    throw error;
  }
};

export const extractCVData = async (prompt: string): Promise<Partial<CVData>> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/extract-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to extract CV data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Backend Extract API Error:", error);
    throw error;
  }
};