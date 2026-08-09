import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, MistakeItem } from '../types';
import { Sparkles, Plus, Trash2, CheckCircle2, User, Briefcase, GraduationCap, Code, Layers, FileText, ArrowRight, Wand2, Building2, LayoutTemplate, Eye, EyeOff, Check, Zap, ShieldCheck } from 'lucide-react';
import { analyzeResumeLocally } from '../utils/atsParser';
import { AutoReworkEngine } from './AutoReworkEngine';
import { AtsBestPracticesDrawer } from './AtsBestPracticesDrawer';

interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  targetJD?: string;
  activeFixMistake?: MistakeItem | null;
  onFinishFixing: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  setResumeData,
  targetJD,
  activeFixMistake,
  onFinishFixing,
}) => {
  const [activeSection, setActiveSection] = useState<'contact' | 'summary' | 'experience' | 'skills' | 'education' | 'projects'>('experience');
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [showAutoReworkModal, setShowAutoReworkModal] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic-executive');

  const [selectedTemplateStyle, setSelectedTemplateStyle] = useState<'modern' | 'professional' | 'minimalist'>('modern');
  const [showLivePreviewModal, setShowLivePreviewModal] = useState<boolean>(true);
  const [isChecklistDrawerOpen, setIsChecklistDrawerOpen] = useState<boolean>(false);

  // Calculate live ATS score
  const liveResult = analyzeResumeLocally(resumeData, targetJD);

  // Helper to update contact
  const updateContact = (field: keyof typeof resumeData.contact, val: string) => {
    setResumeData({
      ...resumeData,
      contact: { ...resumeData.contact, [field]: val }
    });
  };

  // Helper to update summary
  const updateSummary = (val: string) => {
    setResumeData({ ...resumeData, summary: val });
  };

  // AI Bullet Enhancer endpoint caller
  const handleEnhanceBullet = async (expIndex: number, bulletIndex: number) => {
    const bulletText = resumeData.experience[expIndex].bullets[bulletIndex];
    if (!bulletText) return;

    setEnhancingBulletId(`${expIndex}-${bulletIndex}`);
    setAiNotice(null);

    try {
      const res = await fetch('/api/fix-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText,
          roleTitle: resumeData.experience[expIndex].role,
          company: resumeData.experience[expIndex].company,
          targetJD
        })
      });

      const data = await res.json();
      if (data.enhancedBullet) {
        const newExp = [...resumeData.experience];
        newExp[expIndex].bullets[bulletIndex] = data.enhancedBullet;
        setResumeData({ ...resumeData, experience: newExp });
        setAiNotice(`Enhanced bullet #${bulletIndex + 1}: ${data.explanation || 'Added action verb & metric'}`);
      }
    } catch (err) {
      console.error('Enhance bullet error:', err);
      // Fallback local enhancement
      const newExp = [...resumeData.experience];
      newExp[expIndex].bullets[bulletIndex] = bulletText
        .replace(/^helped with/i, 'Spearheaded')
        .replace(/^responsible for/i, 'Orchestrated') + ' resulting in a 25% efficiency improvement.';
      setResumeData({ ...resumeData, experience: newExp });
      setAiNotice('Applied local action verb & metric enhancement.');
    } finally {
      setEnhancingBulletId(null);
    }
  };

  // Add bullet
  const addBullet = (expIndex: number) => {
    const newExp = [...resumeData.experience];
    newExp[expIndex].bullets.push('Spearheaded new initiative resulting in quantifiable 20% efficiency boost.');
    setResumeData({ ...resumeData, experience: newExp });
  };

  // Remove bullet
  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const newExp = [...resumeData.experience];
    newExp[expIndex].bullets.splice(bulletIndex, 1);
    setResumeData({ ...resumeData, experience: newExp });
  };

  // Add experience position
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: `exp-${Date.now()}`,
          company: 'Company Name',
          role: 'Job Title',
          dates: '2023 - Present',
          location: 'City, State',
          bullets: ['Spearheaded project delivering 25% improvement in team efficiency.']
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Live ATS Score Top Bar */}
      <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-700/60 text-red-400 font-bold font-space text-lg flex items-center justify-center">
            {liveResult.overallScore}%
          </div>

          <div>
            <div className="text-xs uppercase font-mono text-zinc-400">Live Recalculating ATS Score</div>
            <div className="text-sm font-bold text-white font-space">
              Grade: <span className="text-red-400">{liveResult.grade}</span> • Words: {liveResult.wordCount} • Metrics: {liveResult.metricCount}
            </div>
          </div>
        </div>

        {activeFixMistake && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-700/60 text-xs text-red-300 font-mono">
            🎯 Rectifying: <span className="font-bold text-white">{activeFixMistake.title}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsChecklistDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 font-bold text-xs font-space tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all"
          >
            <ShieldCheck size={16} className="text-emerald-400 animate-pulse" />
            <span>ATS Best Practices Drawer</span>
          </button>

          <button
            onClick={() => setShowAutoReworkModal(!showAutoReworkModal)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold text-xs uppercase font-cinzel tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-950/80 hover:scale-105 transition-all"
          >
            <Wand2 size={15} />
            <span>1-Click Auto Rework & Templates</span>
          </button>

          <button
            onClick={onFinishFixing}
            className="px-4 py-2 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase font-cinzel tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>View Report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Embedded Auto Rework Engine Component */}
      <AnimatePresence>
        {showAutoReworkModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AutoReworkEngine
              resumeData={resumeData}
              setResumeData={setResumeData}
              targetJD={targetJD}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              onClose={() => setShowAutoReworkModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {aiNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{aiNotice}</span>
        </div>
      )}

      {/* TEMPLATE PICKER SECTION */}
      <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-800/60 text-red-400">
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold font-cinzel text-white flex items-center gap-2">
                <span>ATS Layout Template Picker</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold">
                  Live Preview
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-space">
                Toggle between three distinct ATS-optimized layout styles with real-time formatting updates.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLivePreviewModal(!showLivePreviewModal)}
            className="px-3 py-1.5 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-mono flex items-center gap-1.5 shrink-0 transition-all"
          >
            {showLivePreviewModal ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showLivePreviewModal ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>
        </div>

        {/* 3 Distinct ATS Layout Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'modern',
              name: 'Modern Tech & Eng',
              tagline: 'Left-aligned header, cyan accents, skill chips & high contrast.',
              atsScore: '98% ATS Match',
              icon: Zap,
              color: 'text-sky-400',
              borderColor: 'border-sky-500',
              bgActive: 'bg-[#181d2e] border-sky-500 ring-1 ring-sky-500'
            },
            {
              id: 'professional',
              name: 'Professional Executive',
              tagline: 'Centered serif header, corporate navy dividers & traditional bullets.',
              atsScore: '100% Workday / Taleo Pass',
              icon: ShieldCheck,
              color: 'text-amber-400',
              borderColor: 'border-amber-500',
              bgActive: 'bg-[#221c18] border-amber-500 ring-1 ring-amber-500'
            },
            {
              id: 'minimalist',
              name: 'Minimalist Single-Page',
              tagline: 'Ultra-compact vertical rhythm, high content density & clean dividers.',
              atsScore: '100% Single-Page Fit',
              icon: FileText,
              color: 'text-emerald-400',
              borderColor: 'border-emerald-500',
              bgActive: 'bg-[#16221c] border-emerald-500 ring-1 ring-emerald-500'
            }
          ].map((style) => {
            const isSelected = selectedTemplateStyle === style.id;

            return (
              <div
                key={style.id}
                onClick={() => setSelectedTemplateStyle(style.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? style.bgActive
                    : 'bg-[#11121a] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <style.icon size={15} className={style.color} />
                      <span className="text-xs font-bold text-white font-space">{style.name}</span>
                    </div>

                    {isSelected ? (
                      <span className="p-0.5 rounded-full bg-red-600 text-white">
                        <Check size={12} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Select</span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                    {style.tagline}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                  <span className={`font-bold ${style.color}`}>{style.atsScore}</span>
                  <span className="text-zinc-500 uppercase">Style: {style.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Mini Preview Box */}
        <AnimatePresence>
          {showLivePreviewModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-white text-zinc-900 border border-zinc-300 shadow-2xl space-y-3 font-sans transition-all overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 text-xs font-mono text-zinc-500">
                <span className="font-bold text-zinc-700 flex items-center gap-1.5">
                  <Eye size={14} className="text-red-600" />
                  Live Resume Layout Preview ({selectedTemplateStyle.toUpperCase()} STYLE)
                </span>
                <span>Applicant: {resumeData.contact.fullName || 'John Doe'}</span>
              </div>

              {/* Dynamic Live Rendering Based on Selected Template Style */}
              {selectedTemplateStyle === 'modern' && (
                <div className="space-y-2 text-left p-3 rounded bg-slate-50 border-l-4 border-sky-600">
                  <div className="border-b border-sky-200 pb-2">
                    <h3 className="text-lg font-black text-sky-950 font-sans tracking-tight">
                      {resumeData.contact.fullName || 'YOUR FULL NAME'}
                    </h3>
                    <p className="text-xs text-sky-700 font-medium">
                      {resumeData.experience[0]?.role || 'Professional Role Title'} • {resumeData.contact.location}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                      {resumeData.contact.email} | {resumeData.contact.phone} | {resumeData.contact.linkedin}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-800">
                    <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wider">
                      Work Experience
                    </div>
                    {resumeData.experience.slice(0, 2).map((exp, i) => (
                      <div key={i} className="pl-2 border-l border-sky-300">
                        <div className="flex justify-between font-bold text-[11px] text-zinc-900">
                          <span>{exp.role} @ {exp.company}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{exp.dates}</span>
                        </div>
                        <ul className="list-disc pl-4 text-[10px] text-zinc-700 space-y-0.5">
                          {exp.bullets.slice(0, 2).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplateStyle === 'professional' && (
                <div className="space-y-2 text-center p-3 rounded bg-amber-50/50 border-t-2 border-b-2 border-amber-900">
                  <div className="border-b border-amber-800/30 pb-2">
                    <h3 className="text-lg font-serif font-bold text-amber-950 uppercase tracking-widest">
                      {resumeData.contact.fullName || 'YOUR FULL NAME'}
                    </h3>
                    <p className="text-[11px] text-amber-900 font-serif italic">
                      {resumeData.contact.email} • {resumeData.contact.phone} • {resumeData.contact.location}
                    </p>
                  </div>

                  <div className="text-left space-y-1 text-xs text-zinc-800">
                    <div className="text-[11px] font-serif font-bold uppercase text-amber-950 border-b border-amber-800/20 pb-0.5">
                      Professional Experience
                    </div>
                    {resumeData.experience.slice(0, 2).map((exp, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between font-serif font-bold text-[11px] text-amber-950">
                          <span>{exp.company} — {exp.role}</span>
                          <span className="text-[10px] font-serif italic text-zinc-600">{exp.dates}</span>
                        </div>
                        <ul className="list-disc pl-4 text-[10px] font-serif text-zinc-800 space-y-0.5">
                          {exp.bullets.slice(0, 2).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplateStyle === 'minimalist' && (
                <div className="space-y-1.5 text-left p-2.5 rounded bg-zinc-50 border border-zinc-200">
                  <div className="flex justify-between items-baseline border-b border-zinc-300 pb-1">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 uppercase">
                        {resumeData.contact.fullName || 'YOUR FULL NAME'}
                      </h3>
                      <p className="text-[10px] text-zinc-600">
                        {resumeData.contact.email} | {resumeData.contact.phone} | {resumeData.contact.location}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">1-Page Fit</span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-900">
                    <div className="text-[10px] font-bold text-zinc-800 uppercase tracking-tight border-b border-zinc-200">
                      Experience
                    </div>
                    {resumeData.experience.slice(0, 2).map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold text-[10px] text-zinc-900">
                          <span>{exp.role}, {exp.company}</span>
                          <span className="text-[9px] font-mono text-zinc-500">{exp.dates}</span>
                        </div>
                        <p className="text-[10px] text-zinc-700 pl-2 border-l border-zinc-300">
                          • {exp.bullets[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-2 bg-[#161822]/90 border border-red-900/40 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-cinzel mb-2 px-2">
            Resume Sections
          </div>

          {[
            { id: 'contact', label: '1. Contact Information', icon: User },
            { id: 'summary', label: '2. Professional Summary', icon: FileText },
            { id: 'experience', label: '3. Work Experience', icon: Briefcase },
            { id: 'skills', label: '4. Skills & Hard Tech', icon: Code },
            { id: 'education', label: '5. Education', icon: GraduationCap },
            { id: 'projects', label: '6. Key Projects', icon: Layers },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full p-3 rounded-xl text-xs font-bold font-space text-left flex items-center justify-between transition-all ${
                activeSection === sec.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/80'
                  : 'bg-[#11121a] text-zinc-300 hover:bg-zinc-800/60 hover:text-white border border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <sec.icon size={16} />
                <span>{sec.label}</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Edit →</span>
            </button>
          ))}
        </div>

        {/* Right Section Active Form (8 cols) */}
        <div className="lg:col-span-8 bg-[#161822]/90 border border-red-900/40 rounded-2xl p-6 shadow-xl space-y-5">
          
          {/* SECTION 1: CONTACT */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-zinc-800 pb-2">
                <User size={16} className="text-red-500" />
                Contact Information Header
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.contact.fullName}
                    onChange={(e) => updateContact('fullName', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400">Email Address</label>
                  <input
                    type="text"
                    value={resumeData.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400">Location (City, State)</label>
                  <input
                    type="text"
                    value={resumeData.contact.location}
                    onChange={(e) => updateContact('location', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resumeData.contact.linkedin}
                    onChange={(e) => updateContact('linkedin', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400">GitHub / Portfolio URL</label>
                  <input
                    type="text"
                    value={resumeData.contact.github}
                    onChange={(e) => updateContact('github', e.target.value)}
                    className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SUMMARY */}
          {activeSection === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-zinc-800 pb-2">
                <FileText size={16} className="text-red-500" />
                Professional Summary
              </h3>

              <textarea
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                rows={5}
                className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-3.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                placeholder="2-3 sentences summarizing years of experience, core technical domain, and key quantifiable achievement..."
              />
            </div>
          )}

          {/* SECTION 3: EXPERIENCE & ONE-CLICK AI BULLET FIX */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2">
                  <Briefcase size={16} className="text-red-500" />
                  Work Experience ({resumeData.experience.length})
                </h3>

                <button
                  onClick={addExperience}
                  className="px-3 py-1 rounded-lg bg-red-950 text-red-400 border border-red-800 text-xs font-bold font-mono flex items-center gap-1"
                >
                  <Plus size={13} />
                  Add Position
                </button>
              </div>

              {resumeData.experience.map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="p-4 rounded-xl bg-[#11121a] border border-zinc-800 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIdx].role = e.target.value;
                        setResumeData({ ...resumeData, experience: newExp });
                      }}
                      placeholder="Job Title"
                      className="bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs font-bold text-white"
                    />

                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIdx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: newExp });
                      }}
                      placeholder="Company Name"
                      className="bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  {/* Experience Bullet Points */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Bullet Points (Click ✨ AI Fix to inject metrics & action verbs)
                    </div>

                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[expIdx].bullets[bulletIdx] = e.target.value;
                              setResumeData({ ...resumeData, experience: newExp });
                            }}
                            rows={2}
                            className="flex-1 bg-[#181a26] border border-zinc-700/80 focus:border-red-600 rounded-lg p-2.5 text-xs text-zinc-200 font-mono"
                          />

                          {/* AI Fix Button */}
                          <button
                            onClick={() => handleEnhanceBullet(expIdx, bulletIdx)}
                            disabled={enhancingBulletId === `${expIdx}-${bulletIdx}`}
                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs font-space shrink-0 flex items-center gap-1 shadow-md shadow-red-950/60"
                          >
                            <Sparkles size={13} />
                            <span>{enhancingBulletId === `${expIdx}-${bulletIdx}` ? 'Fixing...' : 'AI Fix'}</span>
                          </button>

                          <button
                            onClick={() => removeBullet(expIdx, bulletIdx)}
                            className="p-2 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addBullet(expIdx)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 pt-1"
                    >
                      <Plus size={12} />
                      Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 4: SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Code size={16} className="text-red-500" />
                Technical & Core Skills
              </h3>

              <div>
                <label className="text-[11px] font-mono text-zinc-400">Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.technical.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setResumeData({ ...resumeData, skills: { ...resumeData.skills, technical: skills } });
                  }}
                  className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400">Tools & Software (Comma Separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.tools.join(', ')}
                  onChange={(e) => {
                    const tools = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setResumeData({ ...resumeData, skills: { ...resumeData.skills, tools } });
                  }}
                  className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-2.5 text-xs font-mono text-white"
                />
              </div>
            </div>
          )}

          {/* SECTION 5: EDUCATION */}
          {activeSection === 'education' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-zinc-800 pb-2">
                <GraduationCap size={16} className="text-red-500" />
                Education
              </h3>

              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#11121a] border border-zinc-800 space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].degree = e.target.value;
                      setResumeData({ ...resumeData, education: newEdu });
                    }}
                    className="w-full bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs font-bold text-white"
                    placeholder="Degree Name"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].institution = e.target.value;
                      setResumeData({ ...resumeData, education: newEdu });
                    }}
                    className="w-full bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs text-white"
                    placeholder="University / College Name"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SECTION 6: PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Layers size={16} className="text-red-500" />
                Projects
              </h3>

              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#11121a] border border-zinc-800 space-y-2">
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[idx].name = e.target.value;
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="w-full bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs font-bold text-white"
                    placeholder="Project Name"
                  />
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[idx].technologies = e.target.value;
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="w-full bg-[#181924] border border-zinc-700/80 rounded-lg p-2 text-xs text-white"
                    placeholder="Technologies Used"
                  />
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Floating Quick Access Button for ATS Best Practices Drawer */}
      <button
        onClick={() => setIsChecklistDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 shadow-2xl shadow-emerald-950 flex items-center gap-2 font-mono text-xs font-bold hover:scale-105 transition-all group"
      >
        <ShieldCheck size={20} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">ATS Practices Checklist</span>
      </button>

      {/* Dynamic ATS Best Practices Slide-Out Drawer */}
      <AtsBestPracticesDrawer
        resumeData={resumeData}
        setResumeData={setResumeData}
        isOpen={isChecklistDrawerOpen}
        onClose={() => setIsChecklistDrawerOpen(false)}
      />

    </div>
  );
};
