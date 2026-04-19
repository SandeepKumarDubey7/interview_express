// Core Resume Types for ATS-Friendly Resume Builder

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  cgpa: string;
  startDate: string;
  endDate: string;
  achievements?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: Certification[];
  achievements: Achievement[];
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  skillsRelevance: number;
  sectionCompleteness: number;
  actionVerbs: number;
  formatting: number;
  lengthOptimization: number;
}

export interface ATSAnalysis {
  score: ATSScore;
  missingKeywords: string[];
  weakSections: string[];
  suggestions: string[];
  matchedKeywords: string[];
  strongPoints: string[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export type TemplateType = 'chronological' | 'functional' | 'combination' | 'minimal';

export interface ResumeTemplate {
  id: TemplateType;
  name: string;
  description: string;
  bestFor: string;
  sections: string[];
  atsCompliant: boolean;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  data: ResumeData;
  createdAt: Date;
  label?: string;
}

export interface SavedResume {
  id: string;
  userId: string;
  templateType: TemplateType;
  data: ResumeData;
  atsScore?: ATSScore;
  createdAt: Date;
  updatedAt: Date;
  versions: ResumeVersion[];
}
