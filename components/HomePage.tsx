import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react';
import { FileText, Sparkles, Shield, Users } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-overleaf-50 flex flex-col">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Create Professional CVs with
            <span className="text-overleaf-600"> AI-Powered</span> Tools
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Build stunning, professional CVs in minutes with our intelligent editor.
            Powered by AI to help you craft the perfect resume for your dream job.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="bg-overleaf-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-overleaf-700 transition-colors text-lg">
                  Get Started Free
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="border border-overleaf-600 text-overleaf-600 px-8 py-3 rounded-lg font-medium hover:bg-overleaf-50 transition-colors text-lg">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => navigate('/create')}
              className="bg-overleaf-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-overleaf-700 transition-colors text-lg"
            >
              Start Creating
            </button>
          </SignedIn>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="bg-overleaf-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-overleaf-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered Generation</h3>
            <p className="text-slate-600">
              Let AI help you generate professional content tailored to your industry and experience level.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="bg-overleaf-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-overleaf-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Professional Templates</h3>
            <p className="text-slate-600">
              Choose from carefully designed templates that follow industry standards and best practices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="bg-overleaf-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-overleaf-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600">
              Your data is secure and private. Only you have access to your CV information and documents.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <SignedOut>
          <div className="bg-overleaf-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to create your professional CV?</h3>
            <p className="text-overleaf-100 mb-6">
              Join thousands of professionals who have created their CVs with our platform.
            </p>
            <SignUpButton mode="modal">
              <button className="bg-white text-overleaf-600 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Start Creating Now
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
