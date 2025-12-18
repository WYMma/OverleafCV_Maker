import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react';
import { FileText, Sparkles, Shield, Users, FolderOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mesh flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-4xl py-24 sm:py-32">
            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-primary-600 ring-1 ring-inset ring-primary-500/20 bg-primary-500/5 mb-8">
                <Sparkles size={14} className="mr-2" />
                <span>AI-Powered CV Generation is here</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8 leading-[1.1]">
                Build your dream career with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
                  HireDocs
                </span>
              </h1>
              <p className="text-lg leading-8 text-slate-600 mb-10 max-w-2xl mx-auto">
                Stop struggling with formatting. Our intelligent AI editor helps you craft
                stunning, professional CVs tailored to your dream job in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <SignedIn>
                  <button
                    onClick={() => navigate('/create')}
                    className="btn-premium group relative bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-premium hover:shadow-primary-500/25 flex items-center gap-2"
                  >
                    Start Creating
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/my-cvs')}
                    className="group px-8 py-4 rounded-2xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-2"
                  >
                    <FolderOpen size={20} className="group-hover:scale-110 transition-transform" />
                    My Saved Documents
                  </button>
                </SignedIn>

                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="btn-premium bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold shadow-premium hover:bg-primary-500 flex items-center gap-2">
                      Get Started Free
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="px-10 py-4 rounded-2xl font-semibold text-slate-600 hover:text-slate-900 transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Demo Section (Subtle) */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="text-primary-600" />,
                title: "AI Writing Assistant",
                desc: "Generate professional bullet points that highlight your impact and achievements."
              },
              {
                icon: <FileText className="text-primary-600" />,
                title: "LaTeX Precision",
                desc: "Export pixel-perfect PDFs that pass ATS systems and wow recruiters."
              },
              {
                icon: <Shield className="text-primary-600" />,
                title: "Enterprise Security",
                desc: "Your data is encrypted and private. Only you have access to your resume data."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-8 rounded-3xl group hover:shadow-premium transition-all duration-500 animate-in fade-in slide-in-from-bottom-12"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <div className="bg-primary-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <SignedOut>
          <div className="max-w-7xl mx-auto px-6 pb-24 w-full">
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 sm:p-20 text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#10b981_0,transparent_50%)]" />
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 relative">Ready to land your dream job?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative">
                Join thousands of professionals who have leveled up their career with HireDocs.
              </p>
              <SignUpButton mode="modal">
                <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors relative">
                  Join for Free
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
