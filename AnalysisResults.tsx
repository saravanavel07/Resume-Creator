import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ATSAnalysisResult, MistakeItem, ResumeData } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { COMPANY_ATS_FORMATS, applyAutoReworkTransformation } from '../data/companyAtsFormats';
import { RESUME_TEMPLATES } from '../data/resumeTemplates';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Filter,
  ShieldAlert,
  Check,
  History,
  MapPin,
  HeartHandshake,
  Wrench,
  Wand2,
  Building2,
  LayoutTemplate,
  RefreshCw,
  Zap
} from 'lucide-react';

interface AnalysisResultsProps {
  result: ATSAnalysisResult;
  onGoToFixer: (mistake?: MistakeItem) => void;
  onApplyQuickFix?: (mistake: MistakeItem) => void;
  onGoToHistory?: () => void;
  resumeData?: ResumeData;
  setResumeData?: (data: ResumeData) => void;
  targetJD?: string;
  onReAnalyze?: (newData?: ResumeData) => void;
  aiPowered?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onGoToFixer,
  onApplyQuickFix,
  onGoToHistory,
  resumeData,
  setResumeData,
  targetJD,
  onReAnalyze,
  aiPowered = true,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'tip'>('all');
  const [fixedMistakes, setFixedMistakes] = useState<Set<string>>(new Set());
  const [selectedFormatId, setSelectedFormatId] = useState<string>('workday-taleo-standard');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic-executive');
  const [isApplyingFormat, setIsApplyingFormat] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const filteredMistakes = result.mistakes.filter(
    (m) => filterSeverity === 'all' || m.severity === filterSeverity
  );

  const handleFixClick = (mistake: MistakeItem) => {
    if (onApplyQuickFix) {
      onApplyQuickFix(mistake);
      setFixedMistakes((prev) => new Set(prev).add(mistake.id));
    }
    onGoToFixer(mistake);
  };

  const handleApplyCompanyFormat = (formatId: string) => {
    if (!resumeData || !setResumeData) {
      onGoToFixer();
      return;
    }

    setIsApplyingFormat(true);
    setSelectedFormatId(formatId);

    setTimeout(() => {
      const { updatedResume, transformationsApplied } = applyAutoReworkTransformation(
        resumeData,
        formatId,
        targetJD
      );
      setResumeData(updatedResume);

      if (onReAnalyze) {
        onReAnalyze(updatedResume);
      }

      const formatObj = COMPANY_ATS_FORMATS.find((f) => f.id === formatId);
      setAppliedNotice(`✓ Auto-reworked resume for ${formatObj?.companyName || 'Company ATS'} format!`);
      setIsApplyingFormat(false);

      setTimeout(() => setAppliedNotice(null), 4000);
    }, 450);
  };

  // Top 3 Default Formats for direct display
  const top3Formats = COMPANY_ATS_FORMATS.slice(0, 3);
  const otherFormats = COMPANY_ATS_FORMATS.slice(3);

  return (
    <div className="space-y-6">
      
      {/* 1. Score Gauge Component with Fair Score Guarantee */}
      <ScoreGauge result={result} />

      {/* Applied Notice Banner */}
      <AnimatePresence>
        {appliedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-emerald-400 animate-bounce" />
              <span>{appliedNotice}</span>
            </div>
            <button
              onClick={() => onGoToFixer()}
              className="px-2.5 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-[11px] underline"
            >
              Open Builder to Review & Edit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROMINENT SECTION: 3 COMPANY ATS FORMATS & SUGGESTION TEMPLATES COLUMN */}
      <div className="bg-[#161822]/90 border border-red-900/50 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
              <Building2 size={20} className="text-red-500" />
              <span>Target Company ATS Formats & Suggestion Templates</span>
            </h2>
            <p className="text-xs text-zinc-400 font-space mt-0.5">
              Instantly auto-rework your resume to match exact recruiter parsing standards for top corporations & ATS platforms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-red-950 text-red-300 border border-red-800">
              Auto Rework Ready
            </span>
          </div>
        </div>

        {/* 3 Prominent Company ATS Formats Cards */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 size={14} className="text-red-400" />
            <span>Top 3 Corporate ATS Formats (1-Click Auto Rework)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Formats.map((fmt) => {
              const isSelected = selectedFormatId === fmt.id;

              return (
                <div
                  key={fmt.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isSelected
                      ? 'bg-[#1a1d2d] border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#11121a] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{fmt.logoIcon}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {fmt.atsSoftware}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white font-space">{fmt.companyName}</h3>
                    <p className="text-[11px] text-zinc-300 font-mono leading-relaxed line-clamp-2">
                      {fmt.bulletFormula}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyCompanyFormat(fmt.id)}
                    disabled={isApplyingFormat}
                    className={`w-full py-2 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    {isApplyingFormat && selectedFormatId === fmt.id ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Reworking...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 size={13} />
                        <span>Auto-Rework ({fmt.companyName})</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestion Layout Templates Grid */}
        <div className="border-t border-zinc-800/80 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutTemplate size={14} className="text-red-400" />
              <span>Suggested ATS Layout Templates ({RESUME_TEMPLATES.length})</span>
            </div>

            <button
              onClick={() => onGoToFixer()}
              className="text-[11px] font-mono text-red-400 hover:underline flex items-center gap-1"
            >
              <span>Open All Templates in Builder</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {RESUME_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600 text-white ring-1 ring-red-500'
                      : 'bg-[#11121a] border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold truncate text-white">
                    {tmpl.name}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 mt-1 truncate">
                    {tmpl.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Friendly Encouragement Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#171926] via-[#1c1f30] to-[#171926] border border-red-900/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 font-space">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-400 shrink-0">
            <HeartHandshake size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Friendly Advice: You're Only A Few Edits Away From A Great Score!</span>
            </div>
            <p className="text-[11px] text-zinc-300 mt-0.5">
              Review the exact mistake locations below. Click <strong className="text-red-400">"Fix in Editor"</strong> on any item to jump straight into the builder and apply improvements.
            </p>
          </div>
        </div>

        {onGoToHistory && (
          <button
            onClick={onGoToHistory}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-[#11121a] hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <History size={13} />
            <span>Score History</span>
          </button>
        )}
      </div>

      {/* 2. Main Mistake Rectification Section */}
      <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-6 shadow-2xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" />
              <span>Exact Mistake Locations & Rectifications ({result.mistakes.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 font-space mt-0.5">
              Every identified flaw is specified below with its exact section location and friendly fix recommendation.
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#11121a] p-1 rounded-xl border border-zinc-800/80">
            <Filter size={13} className="text-zinc-500 ml-2 mr-1" />
            {(['all', 'critical', 'warning', 'tip'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                  filterSeverity === sev
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Mistakes List Grid */}
        {filteredMistakes.length === 0 ? (
          <div className="text-center py-8 text-emerald-400 font-mono text-xs bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
            ✓ No errors detected for filter "{filterSeverity}". Excellent job!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((mistake) => {
              const isFixed = fixedMistakes.has(mistake.id);

              return (
                <motion.div
                  key={mistake.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFixed
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : mistake.severity === 'critical'
                      ? 'bg-red-950/30 border-red-800/60 shadow-lg shadow-red-950/30'
                      : mistake.severity === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/50'
                      : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    <div className="space-y-2 flex-1">
                      
                      {/* Mistake Category & Location Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        {mistake.severity === 'critical' ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-red-900 text-red-100 border border-red-700">
                            <AlertTriangle size={12} /> Critical Fix
                          </span>
                        ) : mistake.severity === 'warning' ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-900 text-amber-100 border border-amber-700">
                            <AlertTriangle size={12} /> Recommended
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-100 border border-blue-700">
                            <HelpCircle size={12} /> Tip
                          </span>
                        )}

                        <span className="text-xs font-bold text-white font-space">
                          {mistake.title}
                        </span>

                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {mistake.category}
                        </span>
                      </div>

                      {/* Explicit Location Specification */}
                      <p className="text-xs text-zinc-300 leading-relaxed font-space">
                        {mistake.description}
                      </p>

                      {/* Original Weak Text if available */}
                      {mistake.originalText && (
                        <div className="p-2.5 rounded-xl bg-[#0e0f16] border border-zinc-800/80 font-mono text-xs text-zinc-400 space-y-1">
                          <div className="text-red-400 font-bold flex items-center gap-1.5">
                            <MapPin size={13} />
                            <span>Original Text in Your Resume:</span>
                          </div>
                          <div className="text-zinc-200 pl-4 border-l-2 border-red-800">
                            "{mistake.originalText}"
                          </div>
                        </div>
                      )}

                      {/* Friendly Recommendation */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 font-mono space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <Wrench size={13} />
                          <span>Friendly Solution:</span>
                        </div>
                        <div>{mistake.recommendation}</div>
                        {mistake.suggestedFix && (
                          <div className="text-[11px] text-zinc-300 mt-1 pt-1 border-t border-emerald-900/60 font-mono">
                            Suggested Content: <span className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">{mistake.suggestedFix}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Action Button: Rectify in Builder */}
                    <button
                      onClick={() => handleFixClick(mistake)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                        isFixed
                          ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/60 hover:scale-[1.02]'
                      }`}
                    >
                      {isFixed ? (
                        <>
                          <Check size={14} />
                          <span>Fixed in Editor</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Fix Location in Editor</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* 3. Keywords Gap Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Matched Keywords */}
        <div className="bg-[#161822]/90 border border-emerald-900/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-cinzel flex items-center gap-2">
            <CheckCircle size={16} />
            Matched ATS Keywords ({result.matchedKeywords.length})
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.length === 0 ? (
              <span className="text-xs text-zinc-500 font-mono">No keywords evaluated yet.</span>
            ) : (
              result.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                >
                  ✓ {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-cinzel flex items-center gap-2">
            <AlertTriangle size={16} />
            Missing Critical Keywords ({result.missingKeywords.length})
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.length === 0 ? (
              <span className="text-xs text-emerald-400 font-mono">Zero missing keywords! Excellent alignment.</span>
            ) : (
              result.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-950/60 text-red-300 border border-red-800/40"
                >
                  + Add "{kw}"
                </span>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. Strengths & Highlights */}
      {result.strengths.length > 0 && (
        <div className="bg-[#161822]/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-cinzel">
            Fair Score Positive Highlights
          </h3>
          <ul className="space-y-1.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-zinc-300 font-space flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Floating Navigation to Fixer */}
      <div className="flex justify-center">
        <button
          onClick={() => onGoToFixer()}
          className="px-8 py-3.5 rounded-xl font-bold font-cinzel tracking-wider uppercase text-sm bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl shadow-red-950/80 hover:shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Open Interactive Builder & Fix All Locations</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};

