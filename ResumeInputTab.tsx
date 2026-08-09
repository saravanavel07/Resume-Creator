import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Upload,
  Briefcase,
  Sparkles,
  AlertCircle,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  FileType,
  Loader2,
  FileDown,
} from 'lucide-react';
import { ResumeData, SampleResume } from '../types';
import { parseRawTextToResumeData, formatResumeDataToText } from '../utils/atsParser';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { extractTextFromDocument } from '../utils/documentExtract';

interface ResumeInputTabProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  targetJD: string;
  setTargetJD: (jd: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSelectSample: (sample: SampleResume) => void;
}

export const ResumeInputTab: React.FC<ResumeInputTabProps> = ({
  resumeData,
  setResumeData,
  targetJD,
  setTargetJD,
  onAnalyze,
  isAnalyzing,
  onSelectSample,
}) => {
  const [rawText, setRawText] = useState<string>(formatResumeDataToText(resumeData));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExtractingFile, setIsExtractingFile] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync text changes to resumeData
  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseRawTextToResumeData(text);
    setResumeData(parsed);
  };

  // Comprehensive File Upload Handler (.pdf, .docx, .doc, .txt, .md, .rtf)
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsExtractingFile(true);
    setUploadNotice(null);

    try {
      const result = await extractTextFromDocument(file);

      if (!result.text || result.text.trim().length < 10) {
        throw new Error('Extracted text was empty or unreadable. Try pasting text manually.');
      }

      handleTextChange(result.text);

      setUploadNotice({
        type: 'success',
        message: `Successfully extracted ${result.fileType} document "${result.fileName}" (${result.wordCount.toLocaleString()} words loaded).`,
      });
    } catch (err: any) {
      console.error('File import error:', err);
      setUploadNotice({
        type: 'error',
        message: err.message || 'Failed to read document file. Please select a valid PDF, Word (.docx), or Text file.',
      });
    } finally {
      setIsExtractingFile(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1b1c28] via-[#1f1a26] to-[#12131b] border border-red-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/50 text-red-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles size={13} />
            <span>Unique ATS Neural Engine 4.0</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold font-cinzel text-white">
            Audit & Optimize Your Resume For <span className="text-red-500 underline decoration-red-600/60 decoration-2">100% ATS Parsing Success</span>
          </h2>

          <p className="text-sm text-zinc-300 font-space leading-relaxed">
            Drag & drop your resume file (<strong className="text-white">PDF, Word .DOCX, TXT, MD</strong>) or paste text below. Our instant unique AI auditor verifies impact metrics, action verbs, layout hazards, and target Job Description keyword match.
          </p>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Resume Text & Upload (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 font-cinzel flex items-center gap-2">
                <FileText size={16} className="text-red-500" />
                <span>Resume Document Input</span>
              </label>

              <span className="text-xs font-mono text-zinc-400">
                {rawText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Drag & Drop Upload Zone supporting PDF, DOCX, TXT */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-500 bg-red-950/30 text-white shadow-lg shadow-red-950/50'
                  : 'border-zinc-800 hover:border-red-900/60 bg-[#12131c] text-zinc-400'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-input-drop"
              />
              <label htmlFor="file-input-drop" className="cursor-pointer flex flex-col items-center gap-2">
                {isExtractingFile ? (
                  <div className="flex flex-col items-center gap-2 text-red-400">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-xs font-mono">Parsing document content...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-red-500">
                      <Upload size={22} />
                      <FileType size={20} className="text-blue-400" />
                      <FileSpreadsheet size={20} className="text-indigo-400" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-zinc-200 block">
                        Drag & drop your resume file (<strong className="text-red-400">PDF, Word .DOCX, TXT, MD</strong>)
                      </span>
                      <span className="text-[11px] text-zinc-400 block font-mono">
                        or <span className="text-red-400 underline font-bold">click here to browse computer</span>
                      </span>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Upload Notification Banner */}
            {uploadNotice && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-mono border ${
                  uploadNotice.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/50 border-red-800/60 text-red-300'
                }`}
              >
                {uploadNotice.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                )}
                <span>{uploadNotice.message}</span>
              </div>
            )}

            {/* Resume Text Area */}
            <textarea
              value={rawText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste or edit your full resume text here (Header, Professional Summary, Work Experience, Education, Skills)..."
              rows={14}
              className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-4 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all resize-y leading-relaxed"
            />

          </div>
        </div>

        {/* Right Column: Target Job Description & Quick Samples (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Target Job Description Card */}
          <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 font-cinzel flex items-center gap-2">
                <Briefcase size={16} className="text-red-500" />
                <span>Target Job Description (Optional)</span>
              </label>

              <span className="text-[11px] font-mono text-red-400">JD Keyword Match</span>
            </div>

            <p className="text-xs text-zinc-400 leading-normal">
              Paste the target job description to run an exact keyword gap audit and extract missing hard skills.
            </p>

            <textarea
              value={targetJD}
              onChange={(e) => setTargetJD(e.target.value)}
              placeholder="Paste Job Description / Requirements here to run ATS keyword alignment..."
              rows={8}
              className="w-full bg-[#111219] border border-zinc-800 focus:border-red-600 rounded-xl p-3.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Quick Load Sample Resumes Card */}
          <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-cinzel flex items-center gap-2">
              <Play size={14} className="text-red-500 fill-red-500" />
              <span>Quick Demo Templates</span>
            </h3>

            <div className="space-y-2">
              {SAMPLE_RESUMES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full p-3 rounded-xl bg-[#11121a] hover:bg-red-950/40 border border-zinc-800 hover:border-red-700/60 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {sample.role} • {sample.experienceLevel}
                    </div>
                  </div>
                  <span className="text-xs text-red-500 font-mono group-hover:translate-x-1 transition-transform">
                    Load →
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Main Call to Action Button */}
      <div className="flex justify-center pt-2">
        <motion.button
          onClick={onAnalyze}
          disabled={isAnalyzing || rawText.trim().length < 20}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full max-w-xl py-4 rounded-xl font-bold font-cinzel tracking-wider uppercase text-sm shadow-2xl flex items-center justify-center gap-3 transition-all ${
            isAnalyzing || rawText.trim().length < 20
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-red-950/80 hover:shadow-red-600/30 border border-red-500/50'
          }`}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Auditing with Unique ATS Neural Engine 4.0...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Audit Resume & Calculate ATS Score</span>
            </>
          )}
        </motion.button>
      </div>

    </div>
  );
};
