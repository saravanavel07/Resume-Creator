export interface ResumeTemplateOption {
  id: string;
  name: string;
  category: string;
  description: string;
  fontFamily: 'inter' | 'georgia' | 'playfair' | 'roboto' | 'mono';
  headerLayout: 'centered' | 'left-aligned' | 'divided-bar' | 'compact-inline';
  accentColor: string;
  borderStyle: string;
  recommendedFor: string;
  previewBg: string;
}

export const RESUME_TEMPLATES: ResumeTemplateOption[] = [
  {
    id: 'classic-executive',
    name: 'Classic Corporate Executive',
    category: 'Corporate & Finance',
    description: 'Traditional 1-column layout with serif typography and clean dividers. Highest compatibility with legacy ATS systems (Taleo, Workday).',
    fontFamily: 'georgia',
    headerLayout: 'centered',
    accentColor: '#1e3a8a', // navy blue
    borderStyle: 'border-b-2 border-blue-900',
    recommendedFor: 'Finance, Banking, Legal, Executive Leadership, Consulting, Accounting',
    previewBg: 'from-blue-950 to-slate-900'
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech & Engineering',
    category: 'Technology & Software',
    description: 'Sleek, highly structured layout with skill chips, repository links, and high-impact project sections.',
    fontFamily: 'inter',
    headerLayout: 'left-aligned',
    accentColor: '#0284c7', // sky blue
    borderStyle: 'border-b-2 border-sky-600',
    recommendedFor: 'Software Engineers, DevOps, Data Scientists, Product Managers, Tech Lead',
    previewBg: 'from-sky-950 to-slate-900'
  },
  {
    id: 'clean-compact',
    name: 'Clean Compact ATS (1-Page Maximizer)',
    category: 'Universal Single-Page',
    description: 'Ultra-dense, tight vertical rhythm designed to fit maximum experience and skills onto 1 page without overflow.',
    fontFamily: 'roboto',
    headerLayout: 'compact-inline',
    accentColor: '#334155', // slate
    borderStyle: 'border-b border-slate-600',
    recommendedFor: 'Experienced candidates with 10+ years who need a strict 1-page resume',
    previewBg: 'from-slate-900 to-zinc-900'
  },
  {
    id: 'healthcare-clinical',
    name: 'Healthcare & Clinical Specialist',
    category: 'Medical & Nursing',
    description: 'Prominently displays Licensures, Board Certifications, EHR system experience, and Clinical Unit metrics.',
    fontFamily: 'georgia',
    headerLayout: 'divided-bar',
    accentColor: '#059669', // emerald green
    borderStyle: 'border-b-2 border-emerald-600',
    recommendedFor: 'Registered Nurses (RN), Physicians, Pharmacists, Therapists, Medical Techs',
    previewBg: 'from-emerald-950 to-slate-900'
  },
  {
    id: 'academic-fresher',
    name: 'Academic & Graduate Fresher',
    category: 'Students & Entry Level',
    description: 'Prioritizes GPA, academic honors, capstone projects, and internship achievements for entry-level candidates.',
    fontFamily: 'playfair',
    headerLayout: 'centered',
    accentColor: '#7c3aed', // purple
    borderStyle: 'border-b-2 border-purple-600',
    recommendedFor: 'Fresh Graduates, Interns, Research Assistants, Graduate Trainees',
    previewBg: 'from-purple-950 to-slate-900'
  },
  {
    id: 'creative-growth',
    name: 'Creative Growth & Marketing',
    category: 'Marketing & Sales',
    description: 'Highlights key metrics, campaign results, software tools, and portfolio links with modern subtle accents.',
    fontFamily: 'inter',
    headerLayout: 'left-aligned',
    accentColor: '#dc2626', // crimson red
    borderStyle: 'border-b-2 border-red-600',
    recommendedFor: 'Marketing Specialists, Account Executives, Growth Leads, Designers, Content Strategists',
    previewBg: 'from-red-950 to-slate-900'
  }
];
