
export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  technologies: string;
  description: string; // Bullet points separated by newlines
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  speciality: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  year: string;
  details: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  date: string;
  details: string;
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  link: string;
  description: string;
}

export interface ExtracurricularActivity {
  id: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string; // Comma separated
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  extracurricularActivities: ExtracurricularActivity[];
  languages: Language[];
}

export interface SavedCV {
  id: string;
  userId: string;
  name: string;
  cvData: CVData;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_CV_DATA: CVData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  extracurricularActivities: [],
  languages: [],
};