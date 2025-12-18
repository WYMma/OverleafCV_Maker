import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react';
import { FileText, Sparkles, Shield, Users, FolderOpen, LayoutTemplate, Download, CheckCircle, Star, ArrowRight, ChevronDown, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

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
                    <button className="btn-premium group relative bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-premium hover:shadow-primary-500/25 flex items-center gap-2">
                      Get Started Free
                      <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="px-10 py-4 rounded-2xl font-semibold text-slate-600 hover:text-slate-900 transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

              {/* Social Proof Hero Badge */}
              <div className="mt-12 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600">
                    2k+
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Loved by professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-24 bg-white/50 border-y border-white/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Create your resume in 3 easy steps</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our streamlined process helps you build a professional CV without the headache of formatting.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-primary-200 to-slate-200" />

              {[
                {
                  icon: <LayoutTemplate size={32} />,
                  title: "Choose a Template",
                  desc: "Select from our ATS-friendly, professionally designed templates."
                },
                {
                  icon: <Sparkles size={32} />,
                  title: "Fill with AI",
                  desc: "Let our AI assistant rewrite your experience for maximum impact."
                },
                {
                  icon: <Download size={32} />,
                  title: "Export to PDF",
                  desc: "Download a polished, LaTeX-perfect PDF ready for applications."
                }
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center z-10">
                  <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-3xl shadow-xl flex items-center justify-center text-primary-600 mb-6 group hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm mb-4 ring-4 ring-white">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Preview Section */}
        <div className="py-24 bg-slate-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0,transparent_70%)] opacity-50" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="text-left max-w-xl">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-primary-400 ring-1 ring-inset ring-primary-500/20 bg-primary-500/10 mb-4">
                  <Star size={14} className="mr-2" />
                  <span>Premium Designs</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">CVs that get you noticed</h2>
                <p className="text-slate-400 text-lg">
                  Stand out from the pile with our collection of professionally designed, ATS-optimized templates.
                </p>
              </div>
              <button
                onClick={() => navigate('/create')}
                className="group flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                View all templates
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Modern Professional", color: "bg-blue-500" },
                { name: "Creative Minimalist", color: "bg-emerald-500" },
                { name: "Executive Suite", color: "bg-purple-500" }
              ].map((template, i) => (
                <div key={i} className="group relative aspect-[3/4] rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute inset-0 bg-slate-800 p-6 flex flex-col">
                    {/* Mock CV Layout */}
                    <div className="w-1/3 h-4 bg-slate-700 rounded-full mb-6" />
                    <div className="flex gap-4">
                      <div className="w-1/3 space-y-3">
                        <div className="h-20 bg-slate-700/50 rounded-lg" />
                        <div className="h-40 bg-slate-700/50 rounded-lg" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-700 rounded w-3/4" />
                        <div className="h-2 bg-slate-700/50 rounded w-full" />
                        <div className="h-2 bg-slate-700/50 rounded w-full" />
                        <div className="h-2 bg-slate-700/50 rounded w-5/6" />
                        <div className="mt-6 h-4 bg-slate-700 rounded w-1/2" />
                        <div className="h-2 bg-slate-700/50 rounded w-full" />
                        <div className="h-2 bg-slate-700/50 rounded w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                    <div className="flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Use this template <ArrowRight size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Don't take our word for it</h2>
            <p className="text-slate-600">Join thousands of job seekers who found success with HireDocs.</p>
          </div>

          {/* Scrolling Marquee Container */}
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-6 px-6">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6">
                  {[
                    { name: "Sarah J.", role: "Software Engineer", company: "Google", text: "I tried 5 other builders, but HireDocs was the only one that handled my technical skills properly." },
                    { name: "Michael T.", role: "Product Manager", company: "Amazon", text: "The AI suggestions were surprisingly good. It rewrote my bullet points to be much more punchy." },
                    { name: "Elena R.", role: "Designer", company: "Freelance", text: "Beautiful templates that actually pass ATS scanners. I got twice as many callbacks!" },
                    { name: "David K.", role: "Marketing Director", company: "Spotify", text: "Clean, professional, and fast. Exactly what I needed for my last-minute application." },
                    { name: "Jessica W.", role: "Nurse", company: "Mayo Clinic", text: "Simple to use and the PDF export is flawless. Highly recommend!" }
                  ].map((review, i) => (
                    <div key={i} className="inline-block w-[350px] whitespace-normal bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-1 text-yellow-500 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                      </div>
                      <p className="text-slate-700 mb-6 text-sm leading-relaxed">"{review.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{review.name}</div>
                          <div className="text-xs text-slate-500">{review.role} • {review.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Why HireDocs Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why choose HireDocs?</h2>
              <p className="text-slate-600">The competitive edge you need for your job search.</p>
            </div>
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
        </div>

        {/* FAQ Section */}
        <div className="py-24 bg-white/50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-600">Everything you need to know about the product and billing.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Is HireDocs completely free?",
                  a: "Yes! Currently, all features including AI generation and PDF exports are completely free to use."
                },
                {
                  q: "Will my resume pass ATS scanners?",
                  a: "Absolutely. We use standard LaTeX templates that are specifically designed to be easily readable by Applicant Tracking Systems (ATS)."
                },
                {
                  q: "Can I edit my resume after saving?",
                  a: "Yes, you can save your CV to your dashboard and return to edit it at any time."
                },
                {
                  q: "Do I need to know LaTeX?",
                  a: "Not at all. Our editor handles all the formatting for you. You just focus on the content."
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${openFaq === i ? 'ring-2 ring-primary-500/20' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between select-none">
                    {faq.q}
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary-600' : ''}`}
                    />
                  </h3>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-primary-600 p-2 rounded-lg text-white">
                  <FileText size={24} />
                </div>
                <span className="text-xl font-bold text-white">HireDocs</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Professional resume builder tailored for career success. Powered by AI, designed for humans.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} HireDocs. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <Github size={20} color="#ffffff" />
                </a>
                <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <Twitter size={20} color="#ffffff" />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <Linkedin size={20} color="#ffffff" />
                </a>
                <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <Instagram size={20} color="#ffffff" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
