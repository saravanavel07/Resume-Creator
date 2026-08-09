import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from '../types';
import { COMPANY_ATS_FORMATS, applyAutoReworkTransformation } from '../data/companyAtsFormats';
import { RESUME_TEMPLATES, ResumeTemplateOption } from '../data/resumeTemplates';
import { analyzeResumeLocally } from '../utils/atsParser';
import {
  Wand2,
  Sparkles,
  Building2,
  LayoutTemplate,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  RefreshCw,
  X,
  Check,
  Award,
  BookOpen,
  Info
} from 'lucide-react';

interface AutoReworkEngineProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  targetJD?: string;
  selectedTemplateId: string;
  setSelectedTemplateId: (templateId: string) => void;
  onClose?: () => void;
}

export const AutoReworkEngine: React.FC<AutoReworkEngineProps> = ({
  resumeData,
  setResumeData,
  targetJD,
  selectedTemplateId,
  setSelectedTemplateId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'auto-rework' | 'company-formats' | 'templates'>('auto-rework');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('workday-taleo-standard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [reworkSummary, setReworkSummary] = useState<{
    beforeScore: number;
    afterScore: number;
    transformations: string[];
  } | null>(null);

  const initialAnalysis = analyzeResumeLocally(resumeData, targetJD);

  // Trigger 1-Click Auto Rework
  const handleRunAutoRework = (companyFormatId: string = selectedCompanyId) => {
    setIsProcessing(true);
    const beforeScore = initialAnalysis.overallScore;

    setTimeout(() => {
      const { updatedResume, transformationsApplied } = applyAutoReworkTransformation(
        resumeData,
        companyFormatId,
        targetJD
      );

      const afterAnalysis = analyzeResumeLocally(updatedResume, targetJD);

      setResumeData(updatedResume);
      setReworkSummary({
        beforeScore,
        afterScore: afterAnalysis.overallScore,
        transformations: transformationsApplied
      });
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="bg-[#161822] border border-red-900/50 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
            <Wand2 size={22} className="text-red-500 animate-pulse" />
            <span>Auto Rework Engine & Company ATS Formats</span>
          </h2>
          <p className="text-xs text-zinc-400 font-space mt-1">
            Automatically transform, re-align, and rewrite your resume for all departments, job roles, and top corporate ATS systems.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Mode Tabs */}
      <div className="flex flex-wrap gap-2 bg-[#11121a] p-1.5 rounded-xl border border-zinc-800/80">
        <button
          onClick={() => setActiveTab('auto-rework')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold font-space flex items-center justify-center gap-2 transition-all ${
            activeTab === 'auto-rework'
              ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-950/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles size={15} />
          <span>1-Click Auto Rework</span>
        </button>

        <button
          onClick={() => setActiveTab('company-formats')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold font-space flex items-center justify-center gap-2 transition-all ${
            activeTab === 'company-formats'
              ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-950/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Building2 size={15} />
          <span>Company ATS Formats</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold font-space flex items-center justify-center gap-2 transition-all ${
            activeTab === 'templates'
              ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-950/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutTemplate size={15} />
          <span>Resume Templates ({RESUME_TEMPLATES.length})</span>
        </button>
      </div>

      {/* TAB 1: 1-CLICK AUTO REWORK */}
      {activeTab === 'auto-rework' && (
        <div className="space-y-6">
          
          {/* Rework Before vs After Score Result Banner if completed */}
          {reworkSummary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border border-emerald-700/60 shadow-2xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                    <Zap size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-space">
                      1-Click Auto Rework Complete!
                    </h3>
                    <p className="text-xs text-zinc-300 font-mono">
                      Transformed passive verbs, injected quantifiable metrics ($ / %), and cleaned headers.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#11121a] px-4 py-2 rounded-xl border border-emerald-800/60 font-mono text-center">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Before</div>
                    <div className="text-sm font-bold text-amber-400">{reworkSummary.beforeScore}%</div>
                  </div>
                  <ArrowRight size={16} className="text-zinc-500" />
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">New Score</div>
                    <div className="text-base font-black text-emerald-400">{reworkSummary.afterScore}%</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-emerald-900/60 pt-2 space-y-1">
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  Applied Modifications:
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 font-mono">
                  {reworkSummary.transformations.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Current State Diagnostic & Auto Rework Action Card */}
          <div className="p-6 rounded-2xl bg-[#11121a] border border-zinc-800 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                  Universal Auto-Fix Engine
                </span>
                <h3 className="text-base font-bold text-white font-space">
                  Ready to Auto-Rework Entire Resume in 1 Click?
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Current ATS Score: <strong className="text-red-400">{initialAnalysis.overallScore}%</strong> • Weak Passives Found: <strong className="text-amber-400">{initialAnalysis.mistakes.filter(m => m.category === 'Action Verbs').length}</strong> • Metrics: <strong className="text-emerald-400">{initialAnalysis.metricCount}</strong>
                </p>
              </div>

              <button
                onClick={() => handleRunAutoRework(selectedCompanyId)}
                disabled={isProcessing}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold font-cinzel text-xs uppercase tracking-wider shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Reworking All Bullets & Metrics...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    <span>Run 1-Click Auto Rework Now</span>
                  </>
                )}
              </button>
            </div>

            {/* List of Automated Optimizations Included */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-zinc-800/80 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#161822] border border-zinc-800 space-y-1">
                <div className="text-red-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>1. Verbs Upgrade</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Replaces "helped with", "worked on", "responsible for" with high-impact power action verbs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#161822] border border-zinc-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <BarChart3 size={14} />
                  <span>2. Metric Quantification</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Injects realistic impact metrics ($ / % / throughput / team volume) into unquantified bullets.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#161822] border border-zinc-800 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>3. Header & Keyword Clean</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Cleans email/phone formats, formats LinkedIn links, and aligns skills with target JD keywords.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPANY ATS FORMAT PRESETS */}
      {activeTab === 'company-formats' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-zinc-900 via-[#181a26] to-zinc-900 border border-red-900/40 text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 size={16} className="text-red-400" />
              <span>Select a target company format below to automatically restructure your resume:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANY_ATS_FORMATS.map((company) => {
              const isSelected = selectedCompanyId === company.id;

              return (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-[#1a1d2e] border-red-600 shadow-xl shadow-red-950/40 ring-1 ring-red-500'
                      : 'bg-[#11121a] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{company.logoIcon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white font-space">{company.companyName}</h3>
                          <span className="text-[10px] font-mono text-zinc-400">{company.atsSoftware}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="p-1 rounded-full bg-red-600 text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 font-space leading-relaxed">
                      {company.tagline}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#0d0e14] border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                      <div className="text-red-400 font-bold">Bullet Formula:</div>
                      <div className="text-zinc-200">{company.bulletFormula}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCompanyId(company.id);
                      handleRunAutoRework(company.id);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Wand2 size={13} />
                    <span>Apply {company.companyName} Format</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RESUME TEMPLATES SELECTOR */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#11121a] border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span>Select an ATS-Compliant Layout Template for Export & Print:</span>
            <span className="text-red-400 font-bold">Active: {RESUME_TEMPLATES.find(t => t.id === selectedTemplateId)?.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESUME_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1a1d2e] border-red-600 shadow-xl ring-1 ring-red-500'
                      : 'bg-[#11121a] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {tmpl.category}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-red-400 font-bold font-mono flex items-center gap-1">
                          <Check size={14} /> Selected
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white font-space">{tmpl.name}</h3>
                    <p className="text-xs text-zinc-400 font-space leading-relaxed">{tmpl.description}</p>

                    <div className="pt-2 text-[11px] font-mono text-zinc-400 space-y-1">
                      <div><strong className="text-zinc-300">Font:</strong> {tmpl.fontFamily}</div>
                      <div><strong className="text-zinc-300">Recommended for:</strong> {tmpl.recommendedFor}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplateId(tmpl.id);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <LayoutTemplate size={13} />
                    <span>{isSelected ? 'Active Template' : 'Choose Template'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
