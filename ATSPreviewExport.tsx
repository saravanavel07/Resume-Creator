import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from '../types';
import {
  Download,
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  FileDown,
  Loader2,
  Eye,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sliders,
  Ruler,
  Layers,
  Search,
  Check,
  FileSpreadsheet,
  ExternalLink,
  HelpCircle,
  X,
} from 'lucide-react';
import { formatResumeDataToText } from '../utils/atsParser';
import { exportToWordDocx } from '../utils/docxExport';

interface ATSPreviewExportProps {
  resumeData: ResumeData;
}

export const ATSPreviewExport: React.FC<ATSPreviewExportProps> = ({ resumeData }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState<boolean>(false);
  const [showDocsGuide, setShowDocsGuide] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [density, setDensity] = useState<'compact' | 'standard' | 'roomy'>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showParserLens, setShowParserLens] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'paper' | 'text'>('paper');
  const documentRef = useRef<HTMLDivElement>(null);

  // Generate plain text
  const plainText = formatResumeDataToText(resumeData);

  // Trigger Word (.docx) generation
  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      await exportToWordDocx(resumeData);
    } catch (err) {
      console.error('Error generating Word document:', err);
      alert('Failed to generate Word document. Please try again or download .TXT as fallback.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  // Trigger Client-Side PDF Generation / Browser Print to PDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule.default || html2pdfModule) as unknown as Function;

      const element = documentRef.current;
      const cleanName = resumeData.contact.fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'ATS';
      const fileName = `${cleanName}_ATS_Resume.pdf`;

      // Helper to convert modern CSS color functions (like oklch) to standard hex/rgb for html2canvas
      const sanitizeOklchCss = (cssContent: string): string => {
        if (!cssContent || !cssContent.includes('oklch')) return cssContent;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        return cssContent.replace(/oklch\([^)]+\)/gi, (match) => {
          if (ctx) {
            try {
              ctx.fillStyle = match;
              const resolved = ctx.fillStyle;
              if (resolved && !resolved.includes('oklch')) {
                return resolved;
              }
            } catch {
              // fallback if canvas parsing fails
            }
          }
          return '#1a1a1a';
        });
      };

      const opt = {
        margin: density === 'compact' ? [0.3, 0.4, 0.3, 0.4] : [0.4, 0.5, 0.4, 0.5],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc: Document) => {
            // Convert any oklch color definitions in style tags to standard hex/rgb
            // so html2canvas doesn't throw "Attempting to parse an unsupported color function oklch"
            const styleElements = clonedDoc.querySelectorAll('style');
            styleElements.forEach((style) => {
              if (style.innerHTML && style.innerHTML.includes('oklch')) {
                style.innerHTML = sanitizeOklchCss(style.innerHTML);
              }
            });

            // Convert inline element styles if any contain oklch
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              if (htmlEl.style && htmlEl.style.cssText && htmlEl.style.cssText.includes('oklch')) {
                htmlEl.style.cssText = sanitizeOklchCss(htmlEl.style.cssText);
              }
            });
          },
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await (html2pdf() as any).set(opt).from(element).save();
    } catch (err) {
      console.error('Error in html2pdf generation, opening browser print dialog as fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.contact.fullName.replace(/\s+/g, '_') || 'ATS'}_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Font class dynamic getter
  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-[Georgia,serif]';
      case 'mono':
        return 'font-[Courier_New,Courier,monospace]';
      case 'sans':
      default:
        return 'font-[Arial,Helvetica,sans-serif]';
    }
  };

  // Density spacing dynamic getter
  const getDensityClass = () => {
    switch (density) {
      case 'compact':
        return 'p-6 sm:p-8 space-y-4 text-[11px] leading-snug';
      case 'roomy':
        return 'p-10 sm:p-14 space-y-8 text-xs leading-loose';
      case 'standard':
      default:
        return 'p-8 sm:p-12 space-y-6 text-xs leading-relaxed';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Main Control Panel */}
      <div className="no-print bg-[#161822]/90 border border-red-900/40 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header & Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-950/80 border border-red-800/60 text-red-400">
                <ShieldCheck size={20} />
              </span>
              <h2 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <span>Real-Time ATS Document & PDF Preview</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Syncing
                </span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-space pl-11">
              Interactive 8.5" x 11" Letter document view with standard ATS typography, page guides, and instant client-side PDF export.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs font-space flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all disabled:opacity-60"
              title="Download formatted ATS PDF directly using client-side library"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown size={15} />
                  <span>Download ATS PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isGeneratingDocx}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs font-space flex items-center gap-2 shadow-lg shadow-blue-950/60 transition-all disabled:opacity-60"
              title="Export as Microsoft Word (.docx) & Google Docs compatible file"
            >
              {isGeneratingDocx ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Building .DOCX...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={15} />
                  <span>Download .DOCX (Word)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDocsGuide(!showDocsGuide)}
              className="px-3.5 py-2.5 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-blue-300 border border-blue-900/50 font-bold text-xs font-space flex items-center gap-1.5 transition-all"
              title="View Google Docs & Word import workflow instructions"
            >
              <HelpCircle size={15} className="text-blue-400" />
              <span>Google Docs Guide</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs font-space flex items-center gap-2 transition-all"
              title="Open native print dialog"
            >
              <Printer size={15} className="text-zinc-400" />
              <span>Print Dialog</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2.5 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs font-space flex items-center gap-2 transition-all"
            >
              <Download size={15} className="text-red-400" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2.5 rounded-xl bg-[#11121a] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs font-space flex items-center gap-2 transition-all"
            >
              <Copy size={15} className="text-emerald-400" />
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

        </div>

        {/* Google Docs & Word Import Guide Modal/Banner */}
        <AnimatePresence>
          {showDocsGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 font-space text-xs text-blue-200 space-y-3 relative"
            >
              <button
                onClick={() => setShowDocsGuide(false)}
                className="absolute top-3 right-3 text-blue-400 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <FileSpreadsheet size={18} className="text-blue-400" />
                <span>Google Docs & Microsoft Word Export Process Guide</span>
              </div>

              <p className="text-blue-300 text-xs">
                To guarantee 100% compatibility with applicant tracking systems (Workday, Greenhouse, Taleo, Lever), follow these standard import instructions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Google Docs Process */}
                <div className="p-3 bg-[#0d101d] rounded-xl border border-blue-900/60 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                    <span>Opening in Google Docs:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-300 pl-1">
                    <li>Click <strong className="text-white">Download .DOCX (Word)</strong> above to save the formatted document.</li>
                    <li>Open <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono">Google Drive</a> in your browser.</li>
                    <li>Click <strong className="text-white">+ New → File Upload</strong> and select the downloaded <code className="text-blue-300">.docx</code> file.</li>
                    <li>Double click the uploaded file in Drive and select <strong className="text-white">Open with Google Docs</strong>.</li>
                  </ol>
                </div>

                {/* Microsoft Word Process */}
                <div className="p-3 bg-[#0d101d] rounded-xl border border-blue-900/60 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                    <span>Opening in Microsoft Word:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-300 pl-1">
                    <li>Click <strong className="text-white">Download .DOCX (Word)</strong> above.</li>
                    <li>Double click to open directly in Microsoft Word (Desktop or Web).</li>
                    <li>The document is natively pre-styled with standard ATS heading levels and clean bullet lists.</li>
                    <li>You can freely make final edits and save directly as <code className="text-indigo-300">.docx</code> or <code className="text-indigo-300">.pdf</code>.</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customization Toolbar */}
        <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          {/* View Mode Toggle */}
          <div className="p-2 bg-[#0e0f16] rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Eye size={13} className="text-red-400" />
              <span>View Mode</span>
            </span>
            <div className="flex bg-[#161822] rounded-lg p-0.5 border border-zinc-800">
              <button
                onClick={() => setViewMode('paper')}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  viewMode === 'paper' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                PDF Paper
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  viewMode === 'text' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Raw Text
              </button>
            </div>
          </div>

          {/* Font Selection */}
          <div className="p-2 bg-[#0e0f16] rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Type size={13} className="text-blue-400" />
              <span>ATS Font</span>
            </span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="bg-[#161822] border border-zinc-800 text-white text-[11px] rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="sans">Arial / Standard</option>
              <option value="serif">Times New Roman</option>
              <option value="mono">Courier / Raw</option>
            </select>
          </div>

          {/* Spacing Density */}
          <div className="p-2 bg-[#0e0f16] rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Ruler size={13} className="text-emerald-400" />
              <span>Density</span>
            </span>
            <div className="flex bg-[#161822] rounded-lg p-0.5 border border-zinc-800">
              {(['compact', 'standard', 'roomy'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`px-2 py-1 rounded text-[10px] capitalize transition-all ${
                    density === d ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Parser Lens & Zoom */}
          <div className="p-2 bg-[#0e0f16] rounded-xl border border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setShowParserLens(!showParserLens)}
              className={`px-2.5 py-1 rounded-lg text-[11px] border flex items-center gap-1.5 transition-all ${
                showParserLens
                  ? 'bg-purple-950/80 text-purple-300 border-purple-700 font-bold'
                  : 'bg-[#161822] text-zinc-400 border-zinc-800 hover:text-white'
              }`}
              title="Highlight structural parse blocks recognized by ATS scanners"
            >
              <Sparkles size={12} className={showParserLens ? 'text-purple-400' : 'text-zinc-500'} />
              <span>Parser Lens</span>
            </button>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[10px] w-9 text-center text-white">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ATS Compliance Badges */}
      <div className="no-print bg-[#12131b] border border-zinc-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 size={15} />
          <span>Single-Column Standard</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 size={15} />
          <span>Zero Graphics / Tables</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 size={15} />
          <span>Standard Headings</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 size={15} />
          <span>UTF-8 Bullet Standard</span>
        </div>
      </div>

      {/* Document View Area */}
      {viewMode === 'text' ? (
        <div className="bg-[#0e0f16] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
            <span>Raw Plain-Text ATS Stream</span>
            <span>{plainText.length} characters</span>
          </div>
          <textarea
            readOnly
            value={plainText}
            className="w-full h-96 bg-[#141622] text-zinc-200 border border-zinc-800 rounded-xl p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      ) : (
        /* Paper View Simulation - 8.5 x 11 Letter Frame */
        <div className="flex justify-center overflow-x-auto py-2">
          
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200 w-full max-w-4xl"
          >
            {/* Digital Paper Ruler / Header Tag */}
            <div className="no-print mb-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2">
              <span className="flex items-center gap-1.5">
                <FileText size={13} className="text-red-400" />
                <span>US Letter (8.5" × 11") • Standard 0.5" Margins</span>
              </span>
              <span className="text-zinc-600">Simulated Print Output</span>
            </div>

            {/* Print Target Element */}
            <div
              ref={documentRef}
              className={`ats-print-document bg-white text-black rounded-xl shadow-2xl transition-all border border-zinc-300 relative ${getFontClass()} ${getDensityClass()}`}
            >
              
              {/* Header Contact Block */}
              <div className={`border-b border-zinc-300 pb-4 text-center relative ${
                showParserLens ? 'ring-2 ring-purple-500/50 rounded p-2 bg-purple-50/50' : ''
              }`}>
                {showParserLens && (
                  <span className="absolute top-1 left-1 text-[9px] font-mono bg-purple-700 text-white px-1.5 py-0.5 rounded uppercase">
                    Parser Block: Header & Contact Info
                  </span>
                )}
                
                <h1 className="text-2xl font-bold uppercase tracking-wide text-black font-space">
                  {resumeData.contact.fullName || 'YOUR NAME'}
                </h1>
                
                <div className="text-xs text-zinc-800 mt-1.5 font-mono flex flex-wrap justify-center gap-2">
                  {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
                  {resumeData.contact.phone && <span>• {resumeData.contact.phone}</span>}
                  {resumeData.contact.location && <span>• {resumeData.contact.location}</span>}
                  {resumeData.contact.linkedin && <span>• {resumeData.contact.linkedin}</span>}
                  {resumeData.contact.github && <span>• {resumeData.contact.github}</span>}
                </div>
              </div>

              {/* Summary Block */}
              {resumeData.summary && (
                <div className={`space-y-1 relative ${
                  showParserLens ? 'ring-2 ring-blue-500/50 rounded p-2 bg-blue-50/50' : ''
                }`}>
                  {showParserLens && (
                    <span className="text-[9px] font-mono bg-blue-700 text-white px-1.5 py-0.5 rounded uppercase block mb-1">
                      Parser Block: Executive Summary
                    </span>
                  )}
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 font-space">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-xs text-zinc-800 text-justify leading-relaxed">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {resumeData.experience.length > 0 && (
                <div className={`space-y-3 relative ${
                  showParserLens ? 'ring-2 ring-emerald-500/50 rounded p-2 bg-emerald-50/50' : ''
                }`}>
                  {showParserLens && (
                    <span className="text-[9px] font-mono bg-emerald-700 text-white px-1.5 py-0.5 rounded uppercase block mb-1">
                      Parser Block: Experience & Accomplishments ({resumeData.experience.length} roles)
                    </span>
                  )}

                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 font-space">
                    WORK EXPERIENCE
                  </h2>

                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs font-bold text-black">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="font-mono text-[11px] text-zinc-600">{exp.dates}</span>
                      </div>

                      <ul className="list-disc list-inside space-y-0.5 text-xs text-zinc-800">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-snug">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {(resumeData.skills.technical.length > 0 || resumeData.skills.tools.length > 0) && (
                <div className={`space-y-1 relative ${
                  showParserLens ? 'ring-2 ring-amber-500/50 rounded p-2 bg-amber-50/50' : ''
                }`}>
                  {showParserLens && (
                    <span className="text-[9px] font-mono bg-amber-700 text-white px-1.5 py-0.5 rounded uppercase block mb-1">
                      Parser Block: Indexed Keywords & Tools
                    </span>
                  )}

                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 font-space">
                    SKILLS & COMPETENCIES
                  </h2>
                  <div className="text-xs text-zinc-800 font-mono space-y-0.5">
                    {resumeData.skills.technical.length > 0 && (
                      <div><strong>Technical Skills:</strong> {resumeData.skills.technical.join(', ')}</div>
                    )}
                    {resumeData.skills.tools.length > 0 && (
                      <div><strong>Tools & Software:</strong> {resumeData.skills.tools.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className={`space-y-1 relative ${
                  showParserLens ? 'ring-2 ring-indigo-500/50 rounded p-2 bg-indigo-50/50' : ''
                }`}>
                  {showParserLens && (
                    <span className="text-[9px] font-mono bg-indigo-700 text-white px-1.5 py-0.5 rounded uppercase block mb-1">
                      Parser Block: Credentials & Education
                    </span>
                  )}

                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 font-space">
                    EDUCATION
                  </h2>

                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-zinc-800">
                      <span className="font-bold">{edu.degree} — {edu.institution}</span>
                      <span className="font-mono text-[11px] text-zinc-600">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div className={`space-y-2 relative ${
                  showParserLens ? 'ring-2 ring-teal-500/50 rounded p-2 bg-teal-50/50' : ''
                }`}>
                  {showParserLens && (
                    <span className="text-[9px] font-mono bg-teal-700 text-white px-1.5 py-0.5 rounded uppercase block mb-1">
                      Parser Block: Projects & Portfolio
                    </span>
                  )}

                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 font-space">
                    KEY PROJECTS
                  </h2>

                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="text-xs text-zinc-800">
                      <div className="font-bold">{proj.name} ({proj.technologies})</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

