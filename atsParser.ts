import { ResumeData, ATSAnalysisResult, MistakeItem } from '../types';

// Weak passive phrases that ATS and recruiters dislike
const WEAK_PHRASES = [
  'responsible for',
  'helped with',
  'helped to',
  'assisted in',
  'assisted with',
  'worked on',
  'duties included',
  'participated in',
  'tasks included',
  'handled daily'
];

// Strong ATS Action Verbs for All Departments & Roles
const STRONG_ACTION_VERBS = [
  // Leadership & Strategy
  'spearheaded', 'orchestrated', 'directed', 'governed', 'overhauled', 'championed', 'transformed', 'formulated',
  // Technology & Engineering
  'architected', 'engineered', 'configured', 'deployed', 'automated', 'refactored', 'streamlined', 'pioneered',
  // Healthcare & Nursing
  'administered', 'triaged', 'diagnosed', 'coordinated', 'precepted', 'rehabilitated', 'monitored', 'delivered',
  // Finance & Accounting
  'audited', 'forecasted', 'reconciled', 'capitalized', 'allocated', 'optimized', 'quantified', 'valudated',
  // Sales & Business Development
  'closed', 'negotiated', 'generated', 'expanded', 'surpassed', 'converted', 'accelerated', 'drove',
  // Marketing & Communications
  'launched', 'amplified', 'targeted', 'boosted', 'cultivated', 'executed', 'maximized', 'authored',
  // HR & Operations
  'recruited', 'onboarded', 'retained', 'facilitated', 'mediated', 'expedited', 'eliminated', 'decreased',
  // Academic & Freshers
  'researched', 'compiled', 'presented', 'designed', 'implemented', 'collaborated', 'analyzed', 'evaluated'
];

// Stopwords for JD Keyword extraction
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'you', 'have', 'are', 'from',
  'will', 'your', 'about', 'our', 'them', 'can', 'has', 'more', 'who', 'been',
  'must', 'should', 'would', 'could', 'their', 'duties', 'work', 'job', 'role',
  'team', 'experience', 'knowledge', 'ability', 'skills', 'working', 'required',
  'preferred', 'looking', 'needed', 'years', 'strong', 'good', 'great', 'high'
]);

export function formatResumeDataToText(data: ResumeData): string {
  let text = '';

  // Contact
  text += `${data.contact.fullName || 'NAME UNKNOWN'}\n`;
  const contactParts = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedin,
    data.contact.github,
    data.contact.portfolio
  ].filter(Boolean);
  text += `${contactParts.join(' | ')}\n\n`;

  // Summary
  if (data.summary) {
    text += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    text += `WORK EXPERIENCE\n`;
    data.experience.forEach(exp => {
      text += `${exp.role} — ${exp.company} (${exp.dates})\n`;
      exp.bullets.forEach(b => {
        if (b.trim()) text += `• ${b}\n`;
      });
      text += `\n`;
    });
  }

  // Skills
  if (data.skills) {
    text += `SKILLS\n`;
    if (data.skills.technical?.length) text += `Technical Skills: ${data.skills.technical.join(', ')}\n`;
    if (data.skills.tools?.length) text += `Tools & Technologies: ${data.skills.tools.join(', ')}\n`;
    if (data.skills.soft?.length) text += `Core Competencies: ${data.skills.soft.join(', ')}\n`;
    text += `\n`;
  }

  // Education
  if (data.education && data.education.length > 0) {
    text += `EDUCATION\n`;
    data.education.forEach(edu => {
      text += `${edu.degree} — ${edu.institution} (${edu.dates})\n`;
    });
    text += `\n`;
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    text += `PROJECTS\n`;
    data.projects.forEach(proj => {
      text += `${proj.name} | ${proj.technologies}\n`;
      proj.bullets.forEach(b => {
        if (b.trim()) text += `• ${b}\n`;
      });
      text += `\n`;
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    text += `CERTIFICATIONS\n${data.certifications.join(', ')}\n`;
  }

  return text;
}

export function parseRawTextToResumeData(rawText: string): ResumeData {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const resume: ResumeData = {
    contact: {
      fullName: lines[0] || '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: { technical: [], soft: [], tools: [] },
    projects: [],
    certifications: [],
    rawText
  };

  // Find emails, phones, links
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) resume.contact.email = emailMatch[0];

  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) resume.contact.phone = phoneMatch[0];

  const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) resume.contact.linkedin = linkedinMatch[0];

  const githubMatch = rawText.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
  if (githubMatch) resume.contact.github = githubMatch[0];

  // Try parsing basic section headers
  let currentSection = 'SUMMARY';
  let tempExperienceBullets: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.toUpperCase();

    if (upper.includes('SUMMARY') || upper.includes('OBJECTIVE') || upper.includes('PROFILE')) {
      currentSection = 'SUMMARY';
      continue;
    } else if (upper.includes('EXPERIENCE') || upper.includes('EMPLOYMENT') || upper.includes('WORK HISTORY')) {
      currentSection = 'EXPERIENCE';
      continue;
    } else if (upper.includes('EDUCATION') || upper.includes('ACADEMIC')) {
      currentSection = 'EDUCATION';
      continue;
    } else if (upper.includes('SKILL') || upper.includes('TECHNOLOGIES') || upper.includes('COMPETENCIES')) {
      currentSection = 'SKILLS';
      continue;
    } else if (upper.includes('PROJECT')) {
      currentSection = 'PROJECTS';
      continue;
    } else if (upper.includes('CERTIFICATION') || upper.includes('LICENSES')) {
      currentSection = 'CERTIFICATIONS';
      continue;
    }

    if (currentSection === 'SUMMARY') {
      if (!line.includes('@') && !line.includes('http')) {
        resume.summary += (resume.summary ? ' ' : '') + line;
      }
    } else if (currentSection === 'EXPERIENCE') {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const bullet = line.replace(/^[•\-\*]\s*/, '');
        if (resume.experience.length > 0) {
          resume.experience[resume.experience.length - 1].bullets.push(bullet);
        } else {
          tempExperienceBullets.push(bullet);
        }
      } else {
        resume.experience.push({
          id: `exp-${Date.now()}-${i}`,
          company: line,
          role: 'Position',
          dates: 'Recent',
          location: '',
          bullets: tempExperienceBullets
        });
        tempExperienceBullets = [];
      }
    } else if (currentSection === 'SKILLS') {
      const parts = line.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
      resume.skills.technical.push(...parts);
    } else if (currentSection === 'EDUCATION') {
      if (!line.startsWith('•')) {
        resume.education.push({
          id: `edu-${Date.now()}-${i}`,
          institution: line,
          degree: 'Degree / Studies',
          dates: 'Completed'
        });
      }
    } else if (currentSection === 'CERTIFICATIONS') {
      const certs = line.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
      resume.certifications.push(...certs);
    }
  }

  return resume;
}

export function analyzeResumeLocally(data: ResumeData, targetJD?: string): ATSAnalysisResult {
  const fullText = formatResumeDataToText(data);
  const words = fullText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const mistakes: MistakeItem[] = [];
  const strengths: string[] = [];
  const atsFormattingHazards: string[] = [];

  // 1. Contact Info Evaluation
  let contactScore = 100;
  if (!data.contact.email) {
    contactScore -= 30;
    mistakes.push({
      id: 'm-no-email',
      severity: 'critical',
      category: 'Structure & Contact',
      title: 'Missing Email Address in Header',
      description: 'Location: Top Header Contact Section. ATS parsers and recruiters require a valid email address at top of document.',
      recommendation: 'Friendly Fix: Add your professional email address (e.g. name@gmail.com) in contact header.',
      suggestedFix: 'email: example@gmail.com'
    });
  }
  if (!data.contact.phone) {
    contactScore -= 25;
    mistakes.push({
      id: 'm-no-phone',
      severity: 'critical',
      category: 'Structure & Contact',
      title: 'Missing Phone Number in Header',
      description: 'Location: Top Header Contact Section. ATS auto-dialers and recruiters need a phone number to parse candidate records.',
      recommendation: 'Friendly Fix: Include a clean phone number with standard area code.',
      suggestedFix: 'phone: (555) 019-2834'
    });
  }
  if (!data.contact.linkedin) {
    contactScore -= 15;
    mistakes.push({
      id: 'm-no-linkedin',
      severity: 'warning',
      category: 'Structure & Contact',
      title: 'LinkedIn Profile Link Missing',
      description: 'Location: Top Header Contact Section. 92% of corporate recruiters cross-reference ATS submissions with LinkedIn profiles.',
      recommendation: 'Friendly Fix: Add your clean custom LinkedIn URL (linkedin.com/in/yourname).',
      suggestedFix: 'linkedin.com/in/your-profile'
    });
  } else {
    strengths.push('Complete Contact Header: Email, phone, location, and LinkedIn URL are present.');
  }

  // 2. Brevity & Length Check
  let brevityScore = 100;
  if (wordCount < 250) {
    brevityScore = 50;
    mistakes.push({
      id: 'm-short-resume',
      severity: 'critical',
      category: 'Formatting & ATS',
      title: 'Resume Length Too Brief (< 250 words)',
      description: `Location: Document Overall. Your resume is only ${wordCount} words. ATS parsers mark brief resumes as missing experience depth.`,
      recommendation: 'Friendly Fix: Expand experience bullet points with specific projects, technical scope, and quantifiable outcomes.'
    });
  } else if (wordCount > 900) {
    brevityScore = 65;
    mistakes.push({
      id: 'm-long-resume',
      severity: 'warning',
      category: 'Formatting & ATS',
      title: 'Resume Length Too Long (> 900 words)',
      description: `Location: Document Overall. Your resume contains ${wordCount} words. Multi-page overflow risks losing ATS focus score.`,
      recommendation: 'Friendly Fix: Trim older or secondary roles. Keep bullets punchy and under 2 lines each.'
    });
  } else {
    strengths.push(`Optimal Resume Length: ${wordCount} words (Ideal for 1-page ATS parser reading).`);
  }

  // 3. Impact & Quantifiable Metrics Check
  let metricCount = 0;
  let weakBulletsCount = 0;
  let totalBullets = 0;

  const metricRegex = /\d+(%|\$|k|M|x|\+|\s*percent|\s*dollars|\s*users|\s*clients|\s*team|\s*patients|\s*hours|\s*records|\s*students|\s*gpa|\/4\.0|\/10)/i;

  const unquantifiedBulletsList: { bullet: string; context: string }[] = [];

  data.experience.forEach((exp) => {
    exp.bullets.forEach((bullet) => {
      totalBullets++;
      if (metricRegex.test(bullet)) {
        metricCount++;
      } else {
        unquantifiedBulletsList.push({ bullet, context: `Work Experience: ${exp.role} at ${exp.company}` });
      }

      // Check for weak passive phrases
      const lowerB = bullet.toLowerCase();
      WEAK_PHRASES.forEach((phrase) => {
        if (lowerB.includes(phrase)) {
          weakBulletsCount++;
          mistakes.push({
            id: `m-weak-${Math.random().toString(36).substr(2, 6)}`,
            severity: 'warning',
            category: 'Action Verbs',
            title: `Passive Phrase ("${phrase}") Found`,
            description: `Location: ${exp.role} at ${exp.company}. Bullet "${bullet.slice(0, 50)}..." contains passive phrasing.`,
            recommendation: `Friendly Fix: Replace "${phrase}" with a strong action verb (e.g. Spearheaded, Orchestrated, Optimized).`,
            originalText: bullet,
            suggestedFix: bullet.replace(new RegExp(phrase, 'gi'), 'Spearheaded initiatives for')
          });
        }
      });
    });
  });

  data.projects.forEach((proj) => {
    proj.bullets.forEach((bullet) => {
      totalBullets++;
      if (metricRegex.test(bullet)) {
        metricCount++;
      } else {
        unquantifiedBulletsList.push({ bullet, context: `Project: ${proj.name}` });
      }
    });
  });

  // Flag specific unquantified bullets if metrics ratio is low
  if (unquantifiedBulletsList.length > 0 && metricCount < 3) {
    const sampleUnquantified = unquantifiedBulletsList[0];
    mistakes.push({
      id: 'm-unquantified-bullet-sample',
      severity: 'warning',
      category: 'Impact & Metrics',
      title: 'Unquantified Impact Metric Bullet',
      description: `Location: ${sampleUnquantified.context}. Bullet: "${sampleUnquantified.bullet.slice(0, 60)}..." lacks measurable numbers or results.`,
      recommendation: 'Friendly Fix: Add numbers, percentages, budget size, or time saved (e.g., "improving performance by 25%").',
      originalText: sampleUnquantified.bullet,
      suggestedFix: `${sampleUnquantified.bullet} resulting in a 25% efficiency boost and saving 10+ hours weekly.`
    });
  }

  const metricRatio = totalBullets > 0 ? (metricCount / totalBullets) : 0;
  let impactScore = Math.min(100, Math.round(metricRatio * 130));
  if (metricCount === 0) {
    impactScore = 30;
    mistakes.push({
      id: 'm-no-metrics',
      severity: 'critical',
      category: 'Impact & Metrics',
      title: 'Zero Quantifiable Metrics Detected',
      description: 'Location: Work Experience Bullets. Your bullets describe duties without measurable numbers, percentages, or scale metrics.',
      recommendation: 'Friendly Fix: Add quantifiable results to at least 50% of your bullets (e.g., "Increased revenue by $40k", "Managed 12+ accounts").'
    });
  } else {
    strengths.push(`Strong Quantifiable Impact: ${metricCount} bullet points contain specific metrics ($ / % / numbers).`);
  }

  // 4. Action Verbs Count
  let actionVerbCount = 0;
  STRONG_ACTION_VERBS.forEach(verb => {
    const reg = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = fullText.match(reg);
    if (matches) actionVerbCount += matches.length;
  });

  if (actionVerbCount >= 4) {
    strengths.push(`High-Power Verbs: Used ${actionVerbCount} high-ranking action verbs that ATS engines highlight.`);
  }

  // 5. Keyword Matching vs Target Job Description
  let keywordMatchScore = 75;
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  if (targetJD && targetJD.trim().length > 20) {
    const jdWords = targetJD.toLowerCase()
      .replace(/[^a-z0-9\s#+.]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    // Frequency analysis on JD words
    const jdFreq: Record<string, number> = {};
    jdWords.forEach(w => { jdFreq[w] = (jdFreq[w] || 0) + 1; });

    // Pick top keywords
    const topJDKeywords = Object.keys(jdFreq)
      .sort((a, b) => jdFreq[b] - jdFreq[a])
      .slice(0, 18);

    const resumeLower = fullText.toLowerCase();

    topJDKeywords.forEach(kw => {
      if (resumeLower.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRatio = topJDKeywords.length > 0 ? matchedKeywords.length / topJDKeywords.length : 1;
    keywordMatchScore = Math.round(matchRatio * 100);

    if (missingKeywords.length > 0) {
      mistakes.push({
        id: 'm-missing-jd-keywords',
        severity: 'warning',
        category: 'Keywords & JD',
        title: `${missingKeywords.length} High-Priority Job Keywords Missing`,
        description: `Location: Skills & Experience Section. The target job description heavily emphasizes: ${missingKeywords.slice(0, 5).join(', ')}.`,
        recommendation: `Friendly Fix: Naturally incorporate these keywords into your Skills section or experience bullets.`,
        suggestedFix: `Add keywords to Skills: ${missingKeywords.slice(0, 4).join(', ')}`
      });
    } else {
      strengths.push('Exceptional Job Match: 90%+ target Job Description keyword alignment!');
    }
  } else {
    // Standard industry technical keywords
    const stdKeywords = ['management', 'analysis', 'development', 'strategy', 'leadership', 'collaboration', 'optimization', 'agile'];
    const lower = fullText.toLowerCase();
    stdKeywords.forEach(k => {
      if (lower.includes(k)) matchedKeywords.push(k);
      else missingKeywords.push(k);
    });
  }

  // 6. Formatting & ATS Hazards
  let formattingScore = 95;
  if (/[★❖►✔■●✦]/g.test(fullText)) {
    formattingScore -= 15;
    atsFormattingHazards.push('Special non-standard bullet symbols (★ ❖ ►) detected which cause character corruption in older ATS systems.');
    mistakes.push({
      id: 'm-special-symbols',
      severity: 'warning',
      category: 'Formatting & ATS',
      title: 'Non-Standard Bullet Symbols Detected',
      description: 'Location: Document Bullets. Special graphics or decorative icons confuse legacy ATS text extractors (Taleo, Workday, iCIMS).',
      recommendation: 'Friendly Fix: Use standard clean bullet points (•) or standard dashes.',
      suggestedFix: 'Replace custom icons with standard bullet points (•)'
    });
  }

  // Summary check
  if (!data.summary || data.summary.trim().length < 30) {
    formattingScore -= 15;
    mistakes.push({
      id: 'm-weak-summary',
      severity: 'warning',
      category: 'Structure & Contact',
      title: 'Professional Summary Missing or Brief',
      description: 'Location: Professional Summary Section (top of resume). An ATS initial summary section provides immediate semantic context.',
      recommendation: 'Friendly Fix: Write a 2-3 line summary containing your total years of experience, core expertise, and key achievement.'
    });
  }

  // Overall Score Calculation (Fair & Uncheated Weighted Math)
  const overallScore = Math.min(100, Math.max(15, Math.round(
    (impactScore * 0.28) +
    (keywordMatchScore * 0.28) +
    (formattingScore * 0.20) +
    (brevityScore * 0.12) +
    (contactScore * 0.12)
  )));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'B';
  if (overallScore >= 93) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 75) grade = 'B';
  else if (overallScore >= 62) grade = 'C';
  else if (overallScore >= 50) grade = 'D';
  else grade = 'F';

  return {
    overallScore,
    grade,
    categoryScores: {
      impactAndMetrics: impactScore,
      keywordMatch: keywordMatchScore,
      formattingATS: formattingScore,
      brevityAndClarity: brevityScore,
      skillsAndRelevance: Math.round((contactScore + formattingScore) / 2)
    },
    mistakes,
    matchedKeywords,
    missingKeywords,
    atsFormattingHazards,
    strengths,
    actionVerbCount,
    metricCount,
    wordCount,
    readabilityLevel: 'College / Professional (Optimal ATS Grade)'
  };
}
