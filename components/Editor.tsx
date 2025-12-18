import React, { useState } from 'react';
import { CVData, Experience, Education, Certification, Project, ExtracurricularActivity } from '../types';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp, AlertCircle, Sparkles, Layout } from 'lucide-react';
import { improveText } from '../services/geminiService';
import { DatePicker } from './DatePicker';

interface EditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const SectionHeader = ({ title, isOpen, toggle }: { title: string, isOpen: boolean, toggle: () => void }) => (
  <button
    onClick={toggle}
    className="w-full flex items-center justify-between p-5 bg-white/40 backdrop-blur-md border-b border-slate-200/60 hover:bg-white/60 transition-all duration-300 group"
  >
    <span className="font-display font-bold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors uppercase text-xs tracking-widest">{title}</span>
    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
      <ChevronDown size={18} className="text-slate-400 group-hover:text-primary-500" />
    </div>
  </button>
);

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('design');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: 'Fluent' as const });

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const updateField = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    onChange({ ...data, [field]: value });
  };

  // Language management functions
  const addLanguage = () => {
    if (!newLanguage.name.trim()) return;

    const language = {
      id: Date.now().toString(),
      name: newLanguage.name.trim(),
      proficiency: newLanguage.proficiency as 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
    };

    const updatedLanguages = [...(data.languages || []), language];
    updateField('languages', updatedLanguages);
    setNewLanguage({ name: '', proficiency: 'Fluent' });
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = (data.languages || []).filter(lang => lang.id !== id);
    updateField('languages', updatedLanguages);
  };

  const updateLanguage = (id: string, field: 'name' | 'proficiency', value: string) => {
    const updatedLanguages = (data.languages || []).map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    updateField('languages', updatedLanguages);
  };

  const isCoreInfoFilled = () => {
    return data.fullName.trim() && data.title.trim() && data.email.trim();
  };

  const ensureCoreInfoOrWarn = (): boolean => {
    if (isCoreInfoFilled()) {
      setValidationError(null);
      return true;
    }
    setValidationError('Please fill in Full Name, Job Title, and Email before using AI features.');
    return false;
  };

  const handleAIImprove = async (field: keyof CVData, context: string) => {
    if (!ensureCoreInfoOrWarn()) return;

    const currentValue = data[field] as string;
    if (!currentValue) return;

    setLoadingAI(field);
    const improved = await improveText(currentValue, context);
    onChange({ ...data, [field]: improved });
    setLoadingAI(null);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      employmentType: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      technologies: '',
      description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange({
      ...data,
      experience: data.experience.map(e => {
        if (e.id === id) {
          const updatedExp = { ...e, [field]: value };
          if (field === 'isCurrent' && value === true) {
            updatedExp.endDate = 'Present';
          } else if (field === 'isCurrent' && value === false) {
            updatedExp.endDate = '';
          }
          return updatedExp;
        }
        return e;
      })
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      speciality: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      year: '',
      details: ''
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    onChange({
      ...data,
      education: data.education.map(e => {
        if (e.id === id) {
          const updatedEdu = { ...e, [field]: value };
          if (field === 'isCurrent' && value === true) {
            updatedEdu.endDate = 'Present';
          } else if (field === 'isCurrent' && value === false) {
            updatedEdu.endDate = '';
          }
          return updatedEdu;
        }
        return e;
      })
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      provider: '',
      date: '',
      details: ''
    };
    onChange({ ...data, certifications: [newCert, ...data.certifications] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter(c => c.id !== id) });
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: '',
      technologies: '',
      link: '',
      description: ''
    };
    onChange({ ...data, projects: [newProj, ...data.projects] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const addExtracurricularActivity = () => {
    const newActivity: ExtracurricularActivity = {
      id: Date.now().toString(),
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    onChange({ ...data, extracurricularActivities: [newActivity, ...data.extracurricularActivities] });
  };

  const updateExtracurricularActivity = (id: string, field: keyof ExtracurricularActivity, value: string | boolean) => {
    onChange({
      ...data,
      extracurricularActivities: data.extracurricularActivities.map(a => {
        if (a.id === id) {
          const updatedActivity = { ...a, [field]: value };
          if (field === 'isCurrent' && value === true) {
            updatedActivity.endDate = 'Present';
          } else if (field === 'isCurrent' && value === false) {
            updatedActivity.endDate = '';
          }
          return updatedActivity;
        }
        return a;
      })
    });
  };

  const removeExtracurricularActivity = (id: string) => {
    onChange({ ...data, extracurricularActivities: data.extracurricularActivities.filter(a => a.id !== id) });
  };

  return (
    <div className="flex flex-col border-r border-slate-200 h-full overflow-y-auto bg-slate-50/50">
      {validationError && (
        <div className="mx-6 mt-4 mb-2 flex items-start rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={16} className="mr-3 mt-0.5 text-amber-500" />
          <span className="leading-relaxed font-semibold">{validationError}</span>
        </div>
      )}


      {/* Design & Template */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Design & Template" isOpen={activeSection === 'design'} toggle={() => toggleSection('design')} />
        {activeSection === 'design' && (
          <div className="p-6 bg-white/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Select CV Standard</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'moderncv', name: 'ModernCV (Default)', desc: 'Clean, elegant, and professional' },
                { id: 'europass', name: 'EuroPass', desc: 'Standard European format for job seekers' },
                { id: 'canadian', name: 'Canadian/banking', desc: 'Clean chronological layout (banking style)' }
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => updateField('template', template.id as any)}
                  className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${data.template === template.id
                    ? 'border-primary-500 bg-primary-50/50 ring-4 ring-primary-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-sm font-bold ${data.template === template.id ? 'text-primary-700' : 'text-slate-700'}`}>
                      {template.name}
                    </span>
                    {data.template === template.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 leading-tight">{template.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Personal Details" isOpen={activeSection === 'personal'} toggle={() => toggleSection('personal')} />
        {activeSection === 'personal' && (
          <div className="p-6 space-y-5 bg-white/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input type="text" placeholder="e.g. John Doe" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Job Title</label>
                <input type="text" placeholder="e.g. Software Engineer" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.title} onChange={e => updateField('title', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                <input type="email" placeholder="e.g. john.doe@email.com" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.email} onChange={e => updateField('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 123-456-7890"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                  value={data.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">LinkedIn</label>
                <input type="text" placeholder="e.g. linkedin.com/in/johndoe" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">GitHub</label>
                <input type="text" placeholder="e.g. github.com/johndoe" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.github} onChange={e => updateField('github', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Portfolio/Website</label>
              <input type="text" placeholder="e.g. www.johndoe.com" className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all" value={data.website} onChange={e => updateField('website', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Professional Summary" isOpen={activeSection === 'summary'} toggle={() => toggleSection('summary')} />
        {activeSection === 'summary' && (
          <div className="p-6 bg-white/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Write your story</label>
              <button
                onClick={() => handleAIImprove('summary', 'Professional resume summary')}
                disabled={loadingAI === 'summary'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all border border-primary-200/50"
              >
                <Sparkles size={12} className={loadingAI === 'summary' ? 'animate-spin' : ''} />
                {loadingAI === 'summary' ? 'Polishing...' : 'AI Enhance'}
              </button>
            </div>
            <textarea
              className="w-full p-4 border border-slate-200 rounded-2xl text-sm h-40 bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all leading-relaxed"
              value={data.summary}
              onChange={e => updateField('summary', e.target.value)}
              placeholder="e.g. Passionate software engineer with 5+ years of experience building scalable web applications..."
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Experience" isOpen={activeSection === 'experience'} toggle={() => toggleSection('experience')} />
        {activeSection === 'experience' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Company</label>
                    <input
                      placeholder="e.g. Google"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={exp.company}
                      onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Role</label>
                    <input
                      placeholder="e.g. Software Engineer"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={exp.role}
                      onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Employment Type</label>
                    <input
                      placeholder="e.g. Full-time"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={exp.employmentType}
                      onChange={e => updateExperience(exp.id, 'employmentType', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Location</label>
                    <input
                      placeholder="e.g. London, UK"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={exp.location}
                      onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Start Date</label>
                    <DatePicker
                      value={exp.startDate}
                      onChange={value => updateExperience(exp.id, 'startDate', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">End Date</label>
                    <DatePicker
                      value={exp.endDate}
                      onChange={value => updateExperience(exp.id, 'endDate', value)}
                      disabled={exp.isCurrent}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3 px-1">
                    <label htmlFor={`current-exp-${exp.id}`} className="text-xs font-bold text-slate-500 uppercase tracking-tight">Currently Working Here</label>
                    <input
                      type="checkbox"
                      id={`current-exp-${exp.id}`}
                      checked={exp.isCurrent}
                      onChange={e => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                      className="h-5 w-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500/30 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 text-primary-600">Key Achievements</label>
                  <textarea
                    placeholder="• Led a team of 5 engineers to deliver a new feature..."
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all leading-relaxed"
                    value={exp.description}
                    onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (!ensureCoreInfoOrWarn()) return;
                      setLoadingAI(`exp-${exp.id}`);
                      const improved = await improveText(exp.description, `Job description for ${exp.role} at ${exp.company}`);
                      updateExperience(exp.id, 'description', improved);
                      setLoadingAI(null);
                    }}
                    disabled={loadingAI === `exp-${exp.id}`}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 bg-white border border-primary-100 shadow-sm hover:bg-primary-50 hover:border-primary-200 transition-all"
                  >
                    <Sparkles size={12} className={loadingAI === `exp-${exp.id}` ? 'animate-spin' : 'text-primary-500'} />
                    {loadingAI === `exp-${exp.id}` ? 'AI...' : 'AI Boost'}
                  </button>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Technologies & Skills</label>
                  <input
                    placeholder="e.g. React, Node.js, Python"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                    value={exp.technologies}
                    onChange={e => updateExperience(exp.id, 'technologies', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Extracurricular Activities */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Extracurricular Activities" isOpen={activeSection === 'extracurricular'} toggle={() => toggleSection('extracurricular')} />
        {activeSection === 'extracurricular' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.extracurricularActivities.map((activity) => (
              <div key={activity.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeExtracurricularActivity(activity.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Organization</label>
                    <input
                      placeholder="e.g. Student Government"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={activity.organization}
                      onChange={e => updateExtracurricularActivity(activity.id, 'organization', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Location</label>
                    <input
                      placeholder="e.g. New York, NY"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={activity.location}
                      onChange={e => updateExtracurricularActivity(activity.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Start Date</label>
                    <DatePicker
                      value={activity.startDate}
                      onChange={value => updateExtracurricularActivity(activity.id, 'startDate', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">End Date</label>
                    <DatePicker
                      value={activity.endDate}
                      onChange={value => updateExtracurricularActivity(activity.id, 'endDate', value)}
                      disabled={activity.isCurrent}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3 px-1">
                    <label htmlFor={`current-activity-${activity.id}`} className="text-xs font-bold text-slate-500 uppercase tracking-tight">Current Activity</label>
                    <input
                      type="checkbox"
                      id={`current-activity-${activity.id}`}
                      checked={activity.isCurrent}
                      onChange={e => updateExtracurricularActivity(activity.id, 'isCurrent', e.target.checked)}
                      className="h-5 w-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500/30 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                  <textarea
                    placeholder="• Organized a university-wide hackathon with 200+ participants..."
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all leading-relaxed"
                    value={activity.description}
                    onChange={e => updateExtracurricularActivity(activity.id, 'description', e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (!ensureCoreInfoOrWarn()) return;
                      setLoadingAI(`activity-${activity.id}`);
                      const improved = await improveText(activity.description, `Extracurricular activity description for ${activity.organization}`);
                      updateExtracurricularActivity(activity.id, 'description', improved);
                      setLoadingAI(null);
                    }}
                    disabled={loadingAI === `activity-${activity.id}`}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 bg-white border border-primary-100 shadow-sm hover:bg-primary-50 hover:border-primary-200 transition-all"
                  >
                    <Sparkles size={12} className={loadingAI === `activity-${activity.id}` ? 'animate-spin' : ''} />
                    {loadingAI === `activity-${activity.id}` ? 'AI...' : 'AI Boost'}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addExtracurricularActivity}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Add Activity
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Education" isOpen={activeSection === 'education'} toggle={() => toggleSection('education')} />
        {activeSection === 'education' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Institution</label>
                    <input
                      placeholder="e.g. University of California, Berkeley"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={edu.institution}
                      onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Degree</label>
                    <input
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={edu.degree}
                      onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Speciality</label>
                    <input
                      placeholder="e.g. Artificial Intelligence"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={edu.speciality}
                      onChange={e => updateEducation(edu.id, 'speciality', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Location</label>
                    <input
                      placeholder="e.g. Berkeley, CA"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={edu.location}
                      onChange={e => updateEducation(edu.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Start Date</label>
                    <DatePicker
                      value={edu.startDate}
                      onChange={value => updateEducation(edu.id, 'startDate', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">End Date</label>
                    <DatePicker
                      value={edu.endDate}
                      onChange={value => updateEducation(edu.id, 'endDate', value)}
                      disabled={edu.isCurrent}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3 px-1">
                    <label htmlFor={`current-edu-${edu.id}`} className="text-xs font-bold text-slate-500 uppercase tracking-tight">Still Studying</label>
                    <input
                      type="checkbox"
                      id={`current-edu-${edu.id}`}
                      checked={edu.isCurrent}
                      onChange={e => updateEducation(edu.id, 'isCurrent', e.target.checked)}
                      className="h-5 w-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500/30 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Additional Details</label>
                  <input
                    placeholder="e.g. GPA: 3.8/4.0, Summa Cum Laude"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                    value={edu.details}
                    onChange={e => updateEducation(edu.id, 'details', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Certifications" isOpen={activeSection === 'certifications'} toggle={() => toggleSection('certifications')} />
        {activeSection === 'certifications' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.certifications.map(cert => (
              <div key={cert.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Certification Name</label>
                    <input
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={cert.name}
                      onChange={e => updateCertification(cert.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Provider</label>
                    <input
                      placeholder="e.g. Amazon Web Services"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={cert.provider}
                      onChange={e => updateCertification(cert.id, 'provider', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Date</label>
                    <DatePicker
                      value={cert.date}
                      onChange={value => updateCertification(cert.id, 'date', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Details</label>
                    <input
                      placeholder="e.g. Associate"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={cert.details}
                      onChange={e => updateCertification(cert.id, 'details', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addCertification}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Projects & Interests" isOpen={activeSection === 'projects'} toggle={() => toggleSection('projects')} />
        {activeSection === 'projects' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.projects.map((proj) => (
              <div key={proj.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Project Name</label>
                    <input
                      placeholder="e.g. Personal Portfolio Website"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={proj.name}
                      onChange={e => updateProject(proj.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Technologies</label>
                    <input
                      placeholder="e.g. React, TypeScript, TailwindCSS"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={proj.technologies}
                      onChange={e => updateProject(proj.id, 'technologies', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Link</label>
                    <input
                      placeholder="e.g. https://github.com/johndoe/portfolio"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={proj.link}
                      onChange={e => updateProject(proj.id, 'link', e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 text-primary-600">Project Mission</label>
                  <textarea
                    placeholder="e.g. A personal portfolio website to showcase my projects and skills..."
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all leading-relaxed"
                    value={proj.description}
                    onChange={e => updateProject(proj.id, 'description', e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (!ensureCoreInfoOrWarn()) return;
                      setLoadingAI(`proj-${proj.id}`);
                      const improved = await improveText(proj.description, `Project description for ${proj.name}`);
                      updateProject(proj.id, 'description', improved);
                      setLoadingAI(null);
                    }}
                    disabled={loadingAI === `proj-${proj.id}`}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 bg-white border border-primary-100 shadow-sm hover:bg-primary-50 hover:border-primary-200 transition-all font-semibold"
                  >
                    <Sparkles size={12} className={loadingAI === `proj-${proj.id}` ? 'animate-spin' : ''} />
                    {loadingAI === `proj-${proj.id}` ? 'AI...' : 'AI Boost'}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="border-b border-slate-100">
        <SectionHeader
          title="Languages"
          isOpen={activeSection === 'languages'}
          toggle={() => toggleSection('languages')}
        />
        {activeSection === 'languages' && (
          <div className="p-6 bg-white/20 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {data.languages?.map((lang) => (
              <div key={lang.id} className="relative p-6 border border-slate-200 rounded-2xl bg-white shadow-premium group">
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:scale-110 transition-all p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Language</label>
                    <input
                      type="text"
                      placeholder="e.g. English"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all"
                      value={lang.name}
                      onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Proficiency</label>
                    <div className="relative">
                      <select
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer"
                        value={lang.proficiency}
                        onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newLang = {
                  id: Date.now().toString(),
                  name: '',
                  proficiency: 'Fluent' as const
                };
                const updatedLanguages = [...(data.languages || []), newLang];
                updateField('languages', updatedLanguages);
              }}
              className="w-full py-4 flex items-center justify-center text-sm font-bold text-primary-600 border-2 border-dashed border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 group"
            >
              <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Add Language
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="border-b border-slate-100">
        <SectionHeader title="Technical Skills" isOpen={activeSection === 'skills'} toggle={() => toggleSection('skills')} />
        {activeSection === 'skills' && (
          <div className="p-6 bg-white/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Skills (comma separated)</label>
              <textarea
                className="w-full p-4 border border-slate-200 rounded-2xl text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none transition-all leading-relaxed"
                value={data.skills}
                onChange={e => updateField('skills', e.target.value)}
                placeholder="e.g. Java, Python, React, AWS, Docker..."
              />
              <button
                onClick={async () => {
                  if (!ensureCoreInfoOrWarn()) return;
                  setLoadingAI('skills');
                  const improved = await improveText(data.skills, "List of technical skills");
                  updateField('skills', improved);
                  setLoadingAI(null);
                }}
                disabled={loadingAI === 'skills'}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 bg-white border border-primary-100 shadow-sm hover:bg-primary-50 hover:border-primary-200 transition-all font-semibold"
              >
                <Sparkles size={12} className={loadingAI === 'skills' ? 'animate-spin' : ''} />
                {loadingAI === 'skills' ? 'AI...' : 'AI Boost'}
              </button>
            </div>
            {data.skills.trim() && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Live Preview</p>
                <div className="flex flex-wrap gap-2 p-4 bg-white/50 border border-slate-100 rounded-2xl">
                  {data.skills.split(',').map(skill => skill.trim()).filter(Boolean).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-primary-50 text-xs font-bold text-primary-700 border border-primary-100 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};