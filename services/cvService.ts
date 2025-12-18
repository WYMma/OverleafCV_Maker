import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface SavedCV {
    id: string;
    userId: string;
    name: string;
    cvData: any;
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get authentication token from Clerk
 */
const getAuthToken = async (getToken: any): Promise<string | null> => {
    try {
        return await getToken();
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

/**
 * Save a new CV
 */
export const saveCV = async (
    name: string,
    cvData: any,
    getToken: any,
    thumbnail?: string
): Promise<SavedCV> => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cvs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, cvData, thumbnail }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save CV');
    }

    return response.json();
};

/**
 * Get all CVs for the authenticated user
 */
export const getUserCVs = async (getToken: any): Promise<SavedCV[]> => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cvs`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch CVs');
    }

    return response.json();
};

/**
 * Get a specific CV by ID
 */
export const getCV = async (id: string, getToken: any): Promise<SavedCV> => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cvs/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch CV');
    }

    return response.json();
};

/**
 * Update an existing CV
 */
export const updateCV = async (
    id: string,
    updates: { name?: string; cvData?: any; thumbnail?: string },
    getToken: any
): Promise<SavedCV> => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cvs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update CV');
    }

    return response.json();
};

/**
 * Delete a CV
 */
export const deleteCV = async (id: string, getToken: any): Promise<void> => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cvs/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete CV');
    }
};
