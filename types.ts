export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  dates: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies: string;
  link?: string;
  bullets: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  projects: ProjectItem[];
  certifications: string[];
  rawText?: string;
}

export interface MistakeItem {
  id: string;
  severity: 'critical' | 'warning' | 'tip';
  category: 'Impact & Metrics' | 'Keywords & JD' | 'Formatting & ATS' | 'Structure & Contact' | 'Action Verbs';
  title: string;
  description: string;
  recommendation: string;
  originalText?: string;
  suggestedFix?: string;
}

export interface ATSAnalysisResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: {
    impactAndMetrics: number;
    keywordMatch: number;
    formattingATS: number;
    brevityAndClarity: number;
    skillsAndRelevance: number;
  };
  mistakes: MistakeItem[];
  matchedKeywords: string[];
  missingKeywords: string[];
  atsFormattingHazards: string[];
  strengths: string[];
  actionVerbCount: number;
  metricCount: number;
  wordCount: number;
  readabilityLevel: string;
}

export interface SampleResume {
  id: string;
  title: string;
  role: string;
  experienceLevel: string;
  data: ResumeData;
  targetJD?: string;
}

export interface ScoreHistoryEntry {
  id: string;
  timestamp: string;
  versionName: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: {
    impactAndMetrics: number;
    keywordMatch: number;
    formattingATS: number;
    brevityAndClarity: number;
    skillsAndRelevance: number;
  };
  mistakeCount: number;
  candidateName?: string;
  targetRole?: string;
  notes?: string;
  resumeData?: ResumeData;
}

