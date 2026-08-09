import React from 'react';
import { motion } from 'motion/react';
import { ATSAnalysisResult } from '../types';
import { Award, Zap, BarChart3, Type, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface ScoreGaugeProps {
  result: ATSAnalysisResult;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ result }) => {
  const { overallScore, grade, categoryScores, actionVerbCount, metricCount, wordCount } = result;

  // Determine gauge color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/40', badgeBg: 'bg-emerald-950 text-emerald-300' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/40', badgeBg: 'bg-amber-950 text-amber-300' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-950/40', border: 'border-red-800/40', badgeBg: 'bg-red-950 text-red-300' };
  };

  const theme = getScoreColor(overallScore);
  const strokeDashoffset = 440 - (440 * overallScore) / 100;

  return (
    <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-4">
      
      {/* Top Friendly Fair Score Assurance Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#11121a] border border-red-900/30 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck size={18} className="shrink-0" />
          <span className="font-bold text-white">100% Authentic & Fair ATS Audit Guarantee</span>
        </div>
        <div className="text-zinc-400 text-[11px]">
          Strict, uncheated algorithm based on real Workday, Taleo, and iCIMS parsing rules.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Animated Circular Score Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-zinc-800/80">
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="70"
                className="stroke-zinc-800/80"
                strokeWidth="12"
                fill="transparent"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="70"
                stroke={theme.stroke}
                strokeWidth="12"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score Number inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className={`text-5xl font-black font-space tracking-tight ${theme.text}`}
              >
                {overallScore}
              </motion.span>
              <span className="text-[11px] text-zinc-400 font-mono tracking-widest uppercase mt-0.5">
                FAIR ATS SCORE / 100
              </span>
            </div>
          </div>

          {/* Grade Pill */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-space">Audit Grade:</span>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold font-cinzel border ${theme.bg} ${theme.text} ${theme.border}`}>
              GRADE {grade}
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 text-center font-mono mt-2 max-w-xs">
            {overallScore >= 85
              ? '🌟 Excellent! High probability of passing top-tier corporate ATS filters.'
              : overallScore >= 70
              ? '⚡ Good foundation! Apply suggested fixes below to reach the top 10% shortlist.'
              : '🔧 Needs refinement! Fix missing contact items or unquantified bullets to boost score.'}
          </p>
        </div>

        {/* Category Sub-Scores Progress Bars */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-cinzel flex items-center gap-2">
              <BarChart3 size={16} className="text-red-500" />
              <span>Weighted Category Score Breakdown</span>
            </h3>

            <div className="group relative cursor-pointer">
              <Info size={14} className="text-zinc-400 hover:text-white" />
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#181a24] border border-red-900/50 p-3 rounded-xl text-[11px] text-zinc-300 hidden group-hover:block z-50 shadow-2xl font-mono leading-relaxed">
                <strong>Fair Weighted Formula:</strong><br/>
                • Metrics & Impact: 28%<br/>
                • JD Keyword Match: 28%<br/>
                • ATS Formatting: 20%<br/>
                • Length & Brevity: 12%<br/>
                • Contact Info: 12%
              </div>
            </div>
          </div>

          {[
            { label: 'Impact & Quantifiable Metrics (28%)', score: categoryScores.impactAndMetrics, icon: Zap },
            { label: 'Job Description Keyword Match (28%)', score: categoryScores.keywordMatch, icon: CheckCircle2 },
            { label: 'Formatting & ATS Cleanliness (20%)', score: categoryScores.formattingATS, icon: Award },
            { label: 'Brevity & Conciseness (12%)', score: categoryScores.brevityAndClarity, icon: Type },
          ].map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <cat.icon size={13} className="text-red-400" />
                  {cat.label}
                </span>
                <span className="text-zinc-400 font-mono font-bold">{cat.score}%</span>
              </div>

              <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-zinc-700/50">
                <motion.div
                  className={`h-full rounded-full ${
                    cat.score >= 80
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      : cat.score >= 65
                      ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, delay: idx * 0.15 }}
                />
              </div>
            </div>
          ))}

          {/* Quick Metrics Counter Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-center">
            <div className="bg-[#12131c] p-2 rounded-lg border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">Word Count</div>
              <div className="text-sm font-bold text-white font-space">{wordCount}</div>
            </div>

            <div className="bg-[#12131c] p-2 rounded-lg border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">Action Verbs</div>
              <div className="text-sm font-bold text-red-400 font-space">{actionVerbCount}</div>
            </div>

            <div className="bg-[#12131c] p-2 rounded-lg border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-mono">Metrics Found</div>
              <div className="text-sm font-bold text-emerald-400 font-space">{metricCount}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
