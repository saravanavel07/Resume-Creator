import { ResumeData } from '../types';

export interface CompanyAtsFormat {
  id: string;
  companyName: string;
  tagline: string;
  atsSoftware: string; // e.g. "Workday", "Taleo", "Lever", "Greenhouse", "iCIMS"
  logoIcon: string;
  primaryColor: string;
  formattingRules: string[];
  bulletFormula: string;
  recommendedVerbs: string[];
  keyEmphasis: string;
  description: string;
}

export const COMPANY_ATS_FORMATS: CompanyAtsFormat[] = [
  {
    id: 'amazon-star',
    companyName: 'Amazon',
    tagline: 'Amazon STAR + Leadership Principles (LP) Format',
    atsSoftware: 'iCIMS / Custom Amazon ATS',
    logoIcon: '📦',
    primaryColor: '#ff9900',
    formattingRules: [
      'Every bullet MUST follow Situation/Task -> Action -> Result (STAR) structure.',
      'Explicitly reference numbers, percentage scale ($ / % / team size / user count).',
      'Incorporate Amazon Leadership Principles implicitly (Customer Obsession, Ownership, Bias for Action, Deliver Results, Invent and Simplify).'
    ],
    bulletFormula: 'Action Verb + Leadership Principle Context + Quantifiable Business Impact ($ / % / metrics)',
    recommendedVerbs: ['Spearheaded', 'Invented', 'Simplified', 'Orchestrated', 'Delivered', 'Pioneered', 'Scaled'],
    keyEmphasis: 'Scale, Speed, Customer Obsession & Ownership',
    description: 'Amazon ATS and recruiters look heavily for data-driven results aligned with Leadership Principles. Avoid generic descriptions.'
  },
  {
    id: 'google-xyz',
    companyName: 'Google',
    tagline: 'Google "Accomplished [X] as measured by [Y] by doing [Z]" Formula',
    atsSoftware: 'Google Internal ATS / Greenhouse',
    logoIcon: '🔍',
    primaryColor: '#4285f4',
    formattingRules: [
      'Strict adherence to Google XYZ Formula: Accomplished [X], as measured by [Y], by doing [Z].',
      'Focus on high technical depth or operational complexity.',
      'Quantify the baseline before and after (e.g. "from 450ms to 120ms latency").'
    ],
    bulletFormula: 'Accomplished [X: clear goal] as measured by [Y: percentage/metric] by doing [Z: action & technical method]',
    recommendedVerbs: ['Architected', 'Engineered', 'Optimized', 'Automated', 'Refactored', 'Deployed', 'Benchmarked'],
    keyEmphasis: 'Technical Mastery, Quantitative Baseline vs After, Scalability',
    description: 'Google recruiters recommend the famous XYZ formula. Every bullet point must state what you accomplished, how it was measured, and what you did.'
  },
  {
    id: 'mckinsey-corporate',
    companyName: 'McKinsey & Co. / Management Consulting',
    tagline: 'Top-Tier Strategy & Structured Impact Format',
    atsSoftware: 'Workday / Talentlink',
    logoIcon: '📊',
    primaryColor: '#0f172a',
    formattingRules: [
      'Top-down MECE (Mutually Exclusive, Collectively Exhaustive) bullet structure.',
      'Lead with financial impact (Revenue Growth, Cost Reduction, Profitability, CAGR).',
      'Demonstrate client-facing leadership, cross-functional synthesis, and executive presentation.'
    ],
    bulletFormula: 'High-Level Financial/Strategic Outcome + Method/Framework + Team & Scope',
    recommendedVerbs: ['Formulated', 'Governed', 'Restructured', 'Audited', 'Maximized', 'Capitalized', 'Negotiated'],
    keyEmphasis: 'Financial Impact ($ Saved/Generated), Strategic Rationale, Executive Presence',
    description: 'Strategy consulting ATS screens evaluate leadership, intellectual rigor, and bottom-line economic metrics.'
  },
  {
    id: 'workday-taleo-standard',
    companyName: 'Corporate Fortune 500 (Workday / Taleo)',
    tagline: 'Universal Clean Parsing Standard for Fortune 500',
    atsSoftware: 'Taleo / Workday / SuccessFactors',
    logoIcon: '🏢',
    primaryColor: '#2563eb',
    formattingRules: [
      'Strict 1-column single-line layout without text boxes or tables.',
      'Standard clean bullet points (•) only.',
      'Standard section headings (WORK EXPERIENCE, EDUCATION, SKILLS, SUMMARY).'
    ],
    bulletFormula: 'Strong Action Verb + Duty Scope + Metric Result + Key Tool Used',
    recommendedVerbs: ['Managed', 'Streamlined', 'Executed', 'Coordinated', 'Implemented', 'Expanded', 'Accelerated'],
    keyEmphasis: 'Clean Structure, High Keyword Match, Parse-Friendly Bullet Symbols',
    description: 'Designed to pass legacy enterprise ATS scanners like Taleo and Workday with 100% text parser accuracy.'
  },
  {
    id: 'healthcare-hospital',
    companyName: 'Healthcare & Clinical Systems (Hospitals / Medical)',
    tagline: 'Clinical Excellence & Patient Outcomes Format',
    atsSoftware: 'Epic / Healthcaresource / Oracle Health',
    logoIcon: '🏥',
    primaryColor: '#059669',
    formattingRules: [
      'Prioritize Licenses & Certifications (RN, BLS, ACLS, Board Certs) right below summary or in header.',
      'Explicitly state unit size, bed count, nurse-to-patient ratios, and EHR system names (Epic, Cerner).',
      'Zero error rates, compliance standards (HIPAA, OSHA), and patient satisfaction scores.'
    ],
    bulletFormula: 'Clinical Action + Patient/Unit Volume + EHR Tool + Outcome/Compliance Standard',
    recommendedVerbs: ['Administered', 'Triaged', 'Coordinated', 'Precepted', 'Diagnosed', 'Monitored', 'Delivered care'],
    keyEmphasis: 'Certifications, EHR Systems, Patient Ratios & Zero-Defect Safety',
    description: 'Medical and healthcare ATS filters match strict credential requirements and EHR proficiency first.'
  },
  {
    id: 'fresher-graduate',
    companyName: 'Fresher & Entry Level Graduate Trainee',
    tagline: 'Academic Excellence, Capstone Projects & Internship Format',
    atsSoftware: 'Jobvite / Lever / Handshake',
    logoIcon: '🎓',
    primaryColor: '#7c3aed',
    formattingRules: [
      'Place Education & Honors (GPA, Coursework) near top.',
      'Highlight Academic Capstone Projects with full bullet breakdown.',
      'Demonstrate leadership in campus organizations, clubs, or volunteer roles.'
    ],
    bulletFormula: 'Action Verb + Academic/Project Scope + Tools/Methodology + Grade/Outcome',
    recommendedVerbs: ['Researched', 'Compiled', 'Designed', 'Analyzed', 'Presented', 'Collaborated', 'Developed'],
    keyEmphasis: 'Academic Achievement, Project Portfolio, Technical Agility',
    description: 'Tailored for candidates with 0-2 years experience to maximize ATS score through project scope and foundational skills.'
  }
];

/**
 * Auto Rework Transformation Engine
 * Automatically upgrades all bullets in a resume data structure to match a chosen company format
 */
export function applyAutoReworkTransformation(
  resumeData: ResumeData,
  formatId: string,
  targetJD?: string
): { updatedResume: ResumeData; transformationsApplied: string[] } {
  const transformationsApplied: string[] = [];
  const format = COMPANY_ATS_FORMATS.find(f => f.id === formatId) || COMPANY_ATS_FORMATS[3];

  const updatedResume: ResumeData = JSON.parse(JSON.stringify(resumeData));

  // 1. Ensure Contact Info Header is Clean & Professional
  if (!updatedResume.contact.email) {
    updatedResume.contact.email = 'applicant.career@email.com';
    transformationsApplied.push('Added professional email placeholder to header.');
  }
  if (!updatedResume.contact.phone) {
    updatedResume.contact.phone = '(555) 019-2834';
    transformationsApplied.push('Added clean phone contact format.');
  }
  if (!updatedResume.contact.linkedin) {
    const cleanName = updatedResume.contact.fullName.toLowerCase().replace(/\s+/g, '');
    updatedResume.contact.linkedin = `linkedin.com/in/${cleanName || 'career-profile'}`;
    transformationsApplied.push('Added custom LinkedIn URL format.');
  }

  // 2. Refine Professional Summary if missing or weak
  if (!updatedResume.summary || updatedResume.summary.length < 40) {
    const primaryRole = updatedResume.experience[0]?.role || 'Professional';
    updatedResume.summary = `Accomplished ${primaryRole} with a proven track record of driving operational efficiency, cross-functional collaboration, and measurable business growth. Proficient in key industry frameworks and dedicated to high-quality results in alignment with ${format.companyName} standards.`;
    transformationsApplied.push('Generated structured Professional Summary aligned with ATS standards.');
  }

  // 3. Transform Work Experience Bullets according to company format
  let bulletIndex = 0;
  updatedResume.experience.forEach((exp) => {
    exp.bullets = exp.bullets.map((bullet) => {
      bulletIndex++;
      let upgraded = bullet.trim();

      // Replace weak passive phrasing
      upgraded = upgraded
        .replace(/^(helped with|helped to|assisted in|assisted with|worked on|duties included|responsible for)/i, format.recommendedVerbs[bulletIndex % format.recommendedVerbs.length])
        .replace(/^(managed|led|handled|created)/i, format.recommendedVerbs[(bulletIndex + 1) % format.recommendedVerbs.length]);

      // Ensure starts with capitalized action verb
      if (!/^[A-Z][a-z]+ed\b/.test(upgraded) && !/^[A-Z][a-z]+\b/.test(upgraded)) {
        const chosenVerb = format.recommendedVerbs[bulletIndex % format.recommendedVerbs.length];
        upgraded = `${chosenVerb} ${upgraded.charAt(0).toLowerCase()}${upgraded.slice(1)}`;
      }

      // Google XYZ formula enforcement
      if (formatId === 'google-xyz' && !upgraded.toLowerCase().includes('as measured by')) {
        if (!/\d+(%|\$|k|M|x)/.test(upgraded)) {
          upgraded += ', as measured by a 32% efficiency gain across system pipelines.';
        } else {
          upgraded = upgraded.replace(/(\d+(?:%|\$|k|M|x|\+|\s*percent)?)/, 'as measured by a $1 improvement');
        }
      }

      // Amazon STAR formula enforcement
      if (formatId === 'amazon-star' && !/\d+(%|\$|k|M|x)/.test(upgraded)) {
        upgraded += ' (Ownership & Customer Obsession: delivered 28% operational velocity increase across 15+ customer accounts).';
      }

      // General metric injection if completely lacking numbers
      if (!/\d+(%|\$|k|M|x|\+|\s*percent|\s*dollars|\s*users|\s*clients|\s*team|\s*patients)/i.test(upgraded)) {
        if (formatId === 'healthcare-hospital') {
          upgraded += ' while maintaining a 99% patient safety score across 12+ daily patient rounds.';
        } else if (formatId === 'mckinsey-corporate') {
          upgraded += ' driving $140k in annualized operational cost optimization.';
        } else if (formatId === 'fresher-graduate') {
          upgraded += ' achieving top 5% distinction score in final project evaluations.';
        } else {
          upgraded += ' resulting in a 25% throughput boost and saving 12+ hours weekly.';
        }
      }

      return upgraded;
    });
  });

  transformationsApplied.push(`Transformed ${bulletIndex} experience bullets into ${format.companyName} (${format.bulletFormula}) format.`);

  // 4. Transform Project Bullets if present
  updatedResume.projects.forEach((proj) => {
    proj.bullets = proj.bullets.map((bullet) => {
      let upgraded = bullet.trim();
      if (!/\d+(%|\$|k|M|x)/.test(upgraded)) {
        upgraded += ' achieving 100% milestone compliance and sub-second execution performance.';
      }
      return upgraded;
    });
  });

  // 5. Ensure Skills are populated and non-empty
  if (!updatedResume.skills.technical || updatedResume.skills.technical.length === 0) {
    updatedResume.skills.technical = ['Data Analysis', 'Project Management', 'Process Optimization', 'Strategic Planning', 'Cross-Functional Leadership'];
    transformationsApplied.push('Populated core technical skills collection.');
  }

  if (!updatedResume.skills.soft || updatedResume.skills.soft.length === 0) {
    updatedResume.skills.soft = ['Critical Thinking', 'Stakeholder Communication', 'Problem Solving', 'Agile Teamwork'];
  }

  if (!updatedResume.skills.tools || updatedResume.skills.tools.length === 0) {
    updatedResume.skills.tools = ['MS Excel (Advanced)', 'Jira', 'Power BI', 'Google Analytics', 'Slack', 'Tableau'];
  }

  return { updatedResume, transformationsApplied };
}
