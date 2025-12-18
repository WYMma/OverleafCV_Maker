import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import HomePage from './components/HomePage';
import EditorPage from './components/EditorPage';
import SelectionPage from './components/SelectionPage';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Layout } from './components/Layout';
import { EditorProvider, useEditorContext } from './context/EditorContext';
import { SavedCVsPage } from './components/SavedCVsPage';
import { SavedCV } from './types';
import { ToastProvider } from './context/ToastContext';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Wrapper component to access EditorContext
function SavedCVsPageWrapper() {
  const navigate = useNavigate();
  const { setCvData, setLoadedCVId } = useEditorContext();

  const handleLoadCV = (cv: SavedCV) => {
    setCvData(cv.cvData);
    setLoadedCVId(cv.id);
    navigate('/editor', { state: { initialData: cv.cvData } });
  };

  return <SavedCVsPage onLoadCV={handleLoadCV} />;
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <EditorProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/create"
                  element={
                    <>
                      <SignedIn>
                        <SelectionPage />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/editor"
                  element={
                    <>
                      <SignedIn>
                        <EditorPage />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/my-cvs"
                  element={
                    <>
                      <SignedIn>
                        <SavedCVsPageWrapper />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/" replace />
                      </SignedOut>
                    </>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </EditorProvider>
    </ClerkProvider>
  </React.StrictMode>
);