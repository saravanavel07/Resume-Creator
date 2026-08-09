import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Wand2,
  X,
  Sparkles,
  Info,
  Calendar,
  Layout,
  FileText,
  User,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AtsBestPracticesDrawerProps {
  resumeData: ResumeData;
  setResumeData?: (data: ResumeData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface BestPracticeRule {
  id: string;
  category: 'Formatting' | 'Structure' | 'Content' | 'Contact';
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  autoFixAvailable: boolean;
  fixAction?: () => void;
}

export const AtsBestPracticesDrawer: React.FC<AtsBestPracticesDrawerProps> = ({
  resumeData,
  setResumeData,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'fail' | 'pass'>('all');

  // Evaluate Rules Real-Time
  const evaluateRules = (): BestPracticeRule[] => {
    const rules: BestPracticeRule[] = [];

    // Rule 1: Graphical Elements & Tables
    rules.push({
      id: 'no-graphics',
      category: 'Formatting',
      title: 'Avoid Graphic Elements & Text Boxes',
      description: 'Legacy ATS parsers cannot read images, charts, icons, or text boxes.',
      status: 'pass', // Default layout is 1-column standard clean text
      details: 'All content is generated in 1-column semantic HTML text paragraphs.',
      autoFixAvailable: false
    });

    // Rule 2: Standard Section Headings
    const hasSummary = Boolean(resumeData.summary && resumeData.summary.trim().length > 10);
    const hasExperience = resumeData.experience.length > 0;
    const hasEducation = resumeData.education.length > 0;
    const hasSkills = Boolean(
      (resumeData.skills.technical.length || 0) +
      (resumeData.skills.tools.length || 0) +
      (resumeData.skills.soft.length || 0) > 0
    );

    const standardHeadingsPass = hasSummary && hasExperience && hasEducation && hasSkills;
    rules.push({
      id: 'standard-headings',
      category: 'Structure',
      title: 'Standard Section Headings Used',
      description: 'Use recognized titles (Professional Summary, Experience, Education, Skills).',
      status: standardHeadingsPass ? 'pass' : 'fail',
      details: standardHeadingsPass
        ? 'All 4 core standard sections exist and contain data.'
        : `Missing or incomplete sections: ${[!hasSummary && 'Summary', !hasExperience && 'Experience', !hasEducation && 'Education', !hasSkills && 'Skills'].filter(Boolean).join(', ')}.`,
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        if (!hasSummary) updated.summary = 'Results-driven professional with demonstrated experience in cross-functional execution and project delivery.';
        if (!hasSkills) updated.skills.technical = ['Project Management', 'Data Analysis', 'Process Optimization'];
        setResumeData(updated);
      }
    });

    // Rule 3: Consistent Date Formatting
    const allDates = [
      ...resumeData.experience.map(e => e.dates),
      ...resumeData.education.map(ed => ed.dates)
    ].filter(Boolean);

    // Check if dates follow standard month/year formats like "Jan 2020 - Present" or "01/2020 - 05/2022"
    const standardDateRegex = /^([A-Z][a-z]{2}\s\d{4}|\d{2}\/\d{4})\s*-\s*([A-Z][a-z]{2}\s\d{4}|\d{2}\/\d{4}|Present|Current)$/i;
    const nonStandardDates = allDates.filter(d => !standardDateRegex.test(d.trim()));
    const datePass = allDates.length > 0 && nonStandardDates.length === 0;

    rules.push({
      id: 'consistent-dates',
      category: 'Formatting',
      title: 'Consistent Standard Date Formatting',
      description: 'Use standard formats like "Jan 2022 - Present" or "01/2022 - 05/2024" across all roles.',
      status: datePass ? 'pass' : nonStandardDates.length > 0 ? 'warning' : 'fail',
      details: datePass
        ? 'All date ranges follow clean standard ATS date syntax.'
        : nonStandardDates.length > 0
        ? `Inconsistent or loose date strings detected (${nonStandardDates.length} entry). Example: "${nonStandardDates[0]}".`
        : 'No work or education dates provided.',
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        updated.experience.forEach((e: any) => {
          if (!standardDateRegex.test(e.dates)) {
            e.dates = 'Jan 2022 - Present';
          }
        });
        updated.education.forEach((ed: any) => {
          if (!standardDateRegex.test(ed.dates)) {
            ed.dates = 'Sep 2018 - May 2022';
          }
        });
        setResumeData(updated);
      }
    });

    // Rule 4: Action Verbs & Passive Phrasing
    let totalBullets = 0;
    let weakBullets = 0;
    const weakRegex = /^(helped with|helped to|assisted in|assisted with|worked on|duties included|responsible for|handled|did)/i;

    resumeData.experience.forEach(e => {
      e.bullets.forEach(b => {
        totalBullets++;
        if (weakRegex.test(b.trim())) {
          weakBullets++;
        }
      });
    });

    const actionVerbPass = totalBullets > 0 && weakBullets === 0;
    rules.push({
      id: 'action-verbs',
      category: 'Content',
      title: 'Strong Action Verbs (No Passive Phrasing)',
      description: 'Avoid weak lead phrases like "responsible for" or "worked on".',
      status: actionVerbPass ? 'pass' : weakBullets > 0 ? 'fail' : 'warning',
      details: actionVerbPass
        ? `All ${totalBullets} experience bullets start with strong active verbs.`
        : `${weakBullets} of ${totalBullets} bullets begin with passive or weak phrasing.`,
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        const powerVerbs = ['Spearheaded', 'Orchestrated', 'Architected', 'Streamlined', 'Engineered', 'Delivered'];
        let count = 0;
        updated.experience.forEach((exp: any) => {
          exp.bullets = exp.bullets.map((b: string) => {
            if (weakRegex.test(b.trim())) {
              count++;
              return b.replace(weakRegex, powerVerbs[count % powerVerbs.length]);
            }
            return b;
          });
        });
        setResumeData(updated);
      }
    });

    // Rule 5: Quantifiable Metrics ($ / %)
    let metricBullets = 0;
    const metricRegex = /\d+(%|\$|k|M|x|\+|\s*percent|\s*dollars|\s*users)/i;

    resumeData.experience.forEach(e => {
      e.bullets.forEach(b => {
        if (metricRegex.test(b)) metricBullets++;
      });
    });

    const metricPercentage = totalBullets > 0 ? Math.round((metricBullets / totalBullets) * 100) : 0;
    const metricPass = metricPercentage >= 50;

    rules.push({
      id: 'quantifiable-metrics',
      category: 'Content',
      title: 'Quantifiable Metrics ($ / % / Metrics)',
      description: 'At least 50% of bullets should contain measurable metrics to prove business impact.',
      status: metricPass ? 'pass' : 'warning',
      details: `${metricBullets} of ${totalBullets} bullets (${metricPercentage}%) contain quantifiable metrics. (Target: 50%+)`,
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        updated.experience.forEach((exp: any) => {
          exp.bullets = exp.bullets.map((b: string) => {
            if (!metricRegex.test(b)) {
              return `${b} resulting in a 25% efficiency increase and saving 10+ hours weekly.`;
            }
            return b;
          });
        });
        setResumeData(updated);
      }
    });

    // Rule 6: Clean Contact Header
    const hasEmail = Boolean(resumeData.contact.email && resumeData.contact.email.includes('@'));
    const hasPhone = Boolean(resumeData.contact.phone && resumeData.contact.phone.length > 6);
    const hasName = Boolean(resumeData.contact.fullName && resumeData.contact.fullName.length > 2);
    const contactPass = hasEmail && hasPhone && hasName;

    rules.push({
      id: 'clean-contact',
      category: 'Contact',
      title: 'Valid Contact Header (Email, Phone & Name)',
      description: 'Ensure email, phone, location, and name are present without full street address.',
      status: contactPass ? 'pass' : 'fail',
      details: contactPass
        ? 'Clean contact header with valid email and phone format.'
        : 'Missing required contact fields (Name, Email, or Phone).',
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        if (!updated.contact.fullName) updated.contact.fullName = 'Jane Doe';
        if (!updated.contact.email) updated.contact.email = 'jane.doe@career.com';
        if (!updated.contact.phone) updated.contact.phone = '(555) 019-2834';
        setResumeData(updated);
      }
    });

    // Rule 7: Bullet Point Symbol Safety
    const nonStandardBulletRegex = /[^\x00-\x7F•\-\s]/;
    let customBulletFound = false;
    resumeData.experience.forEach(e => {
      e.bullets.forEach(b => {
        if (nonStandardBulletRegex.test(b)) customBulletFound = true;
      });
    });

    rules.push({
      id: 'bullet-symbols',
      category: 'Formatting',
      title: 'Standard Bullet Point Symbols Only',
      description: 'Use standard dot bullets (•) or dashes (-). Avoid decorative emoji or special icons in body text.',
      status: customBulletFound ? 'warning' : 'pass',
      details: customBulletFound
        ? 'Non-standard bullet characters or emojis detected in experience text.'
        : 'All bullets use standard ATS dot/dash characters.',
      autoFixAvailable: true,
      fixAction: () => {
        if (!setResumeData) return;
        const updated = JSON.parse(JSON.stringify(resumeData));
        updated.experience.forEach((e: any) => {
          e.bullets = e.bullets.map((b: string) => b.replace(/[^\x00-\x7F•\-\s]/g, ''));
        });
        setResumeData(updated);
      }
    });

    // Rule 8: Word Count & Density
    const fullText = [
      resumeData.summary,
      ...resumeData.experience.flatMap(e => [e.company, e.role, ...e.bullets]),
      ...resumeData.skills.technical,
      ...resumeData.skills.tools
    ].join(' ');
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const wordCountPass = wordCount >= 250 && wordCount <= 750;

    rules.push({
      id: 'word-count',
      category: 'Structure',
      title: 'Optimal Resume Word Count (300-700 words)',
      description: 'Single-page resumes perform best between 300 and 700 total words.',
      status: wordCountPass ? 'pass' : 'warning',
      details: `Current word count: ${wordCount} words. ${
        wordCount < 250 ? 'Resume is slightly too brief for ATS keyword matching.' : wordCount > 750 ? 'Resume may overflow onto 2 pages.' : 'Perfect length.'
      }`,
      autoFixAvailable: false
    });

    return rules;
  };

  const evaluatedRules = evaluateRules();
  const passCount = evaluatedRules.filter(r => r.status === 'pass').length;
  const failCount = evaluatedRules.filter(r => r.status === 'fail').length;
  const warningCount = evaluatedRules.filter(r => r.status === 'warning').length;
  const healthPercentage = Math.round((passCount / evaluatedRules.length) * 100);

  const filteredRules = evaluatedRules.filter(r => {
    if (activeTab === 'fail') return r.status === 'fail' || r.status === 'warning';
    if (activeTab === 'pass') return r.status === 'pass';
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#12131c] border-l border-red-900/60 shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 bg-[#161824] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                      <span>ATS Best Practices Checklist</span>
                    </h2>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Real-time live audit updated as you type
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Bar & Counter */}
              <div className="p-3 rounded-xl bg-[#0d0e15] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-red-400" />
                    Compliance Score
                  </span>
                  <span className="text-emerald-400 font-black">{healthPercentage}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${healthPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                  <span className="text-emerald-400 font-bold">{passCount} Passed</span>
                  <span className="text-amber-400 font-bold">{warningCount} Warnings</span>
                  <span className="text-red-400 font-bold">{failCount} Critical</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 pt-1 font-mono text-xs">
                {(['all', 'fail', 'pass'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-lg border uppercase text-[10px] font-bold transition-all ${
                      activeTab === tab
                        ? 'bg-red-950 border-red-700 text-white shadow-md'
                        : 'bg-[#0f1018] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab === 'all' && `All (${evaluatedRules.length})`}
                    {tab === 'fail' && `Needs Fix (${failCount + warningCount})`}
                    {tab === 'pass' && `Passed (${passCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist Items Scrollable List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono">
              {filteredRules.map(rule => {
                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                      rule.status === 'pass'
                        ? 'bg-[#141620]/80 border-emerald-900/60'
                        : rule.status === 'warning'
                        ? 'bg-[#1a1714]/90 border-amber-800/60'
                        : 'bg-[#1f1416]/90 border-red-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {rule.status === 'pass' && (
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        )}
                        {rule.status === 'warning' && (
                          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                        )}
                        {rule.status === 'fail' && (
                          <XCircle size={18} className="text-red-400 shrink-0" />
                        )}

                        <div>
                          <h4 className="text-xs font-bold text-white font-space">
                            {rule.title}
                          </h4>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {rule.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                          rule.status === 'pass'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : rule.status === 'warning'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-red-950 text-red-300 border-red-800'
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                      {rule.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-zinc-800/80 text-[10px] text-zinc-400 space-y-1">
                      <div className="text-zinc-200 font-bold flex items-center gap-1">
                        <Info size={12} className="text-red-400" />
                        <span>Live Audit Result:</span>
                      </div>
                      <div>{rule.details}</div>
                    </div>

                    {rule.autoFixAvailable && rule.status !== 'pass' && (
                      <button
                        onClick={rule.fixAction}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-xs font-space flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        <Wand2 size={13} />
                        <span>1-Click Auto-Fix Rule</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#161824] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 text-[11px]">
                ATS Best Practices Engine v2.4
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
