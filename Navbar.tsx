import React from 'react';
import { motion } from 'motion/react';
import { FileCheck, Sparkles, CheckSquare, Edit3, Download, Play, History, ShieldCheck } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { SampleResume } from '../types';

interface NavbarProps {
  activeTab: 'input' | 'report' | 'builder' | 'history' | 'export';
  setActiveTab: (tab: 'input' | 'report' | 'builder' | 'history' | 'export') => void;
  onSelectSample: (sample: SampleResume) => void;
  hasAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectSample,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#12141c]/90 backdrop-blur-md border-b border-red-900/30 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Animated Symbol */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-zinc-900 p-[2px] shadow-lg shadow-red-950/50 flex items-center justify-center relative overflow-hidden"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full bg-[#161822] rounded-[10px] flex items-center justify-center text-red-500">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FileCheck size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              </motion.div>
            </div>
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider font-cinzel text-white flex items-center gap-1.5">
                RESUME <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">CORRECT</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-mono font-semibold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                PRO ATS
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-space tracking-tight">
              Unique ATS Engine 4.0 • Score Auditor & Resume Optimizer
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#1a1d28] p-1 rounded-xl border border-zinc-800/80 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
              activeTab === 'input'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles size={14} />
            <span>1. Resume & JD Input</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            disabled={!hasAnalysis}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
              !hasAnalysis
                ? 'text-zinc-600 cursor-not-allowed'
                : activeTab === 'report'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <CheckSquare size={14} />
            <span>2. ATS Score Report</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
              activeTab === 'builder'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Edit3 size={14} />
            <span>3. Fix & Build</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
              activeTab === 'history'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <History size={14} />
            <span>4. Score History</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
              activeTab === 'export'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Download size={14} />
            <span>5. Export ATS Resume</span>
          </button>
        </div>

        {/* Right Controls: Sample Loader */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#1e212d] text-zinc-300 hover:text-white border border-zinc-700/60 transition-all shadow-md">
              <Play size={12} className="text-red-400 fill-red-400" />
              <span>Try Sample</span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-64 bg-[#181a24] border border-red-900/40 rounded-xl shadow-2xl p-2 hidden group-hover:block group-focus-within:block z-50">
              <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider font-mono">
                Select Sample Resume
              </div>
              {SAMPLE_RESUMES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left p-2 rounded-lg hover:bg-red-950/40 hover:border hover:border-red-800/50 text-xs transition-all mb-1"
                >
                  <div className="font-semibold text-white">{sample.title}</div>
                  <div className="text-[11px] text-zinc-400">{sample.role} • {sample.experienceLevel}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-emerald-800/60 bg-emerald-950/40 text-emerald-400 font-mono">
            <ShieldCheck size={13} />
            <span>Unique AI 4.0</span>
          </div>
        </div>

      </div>
    </header>
  );
};
