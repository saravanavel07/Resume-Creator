import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  History as HistoryIcon,
  Save,
  Trash2,
  Edit3,
  Check,
  X,
  RotateCcw,
  Layers,
  Award,
  Sparkles,
  Clock,
  BarChart2,
  FileText,
  AlertCircle,
  Download,
  Info,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { ScoreHistoryEntry, ATSAnalysisResult, ResumeData } from '../types';
import {
  getScoreHistory,
  addScoreEntry,
  updateScoreEntry,
  deleteScoreEntry,
  clearScoreHistory,
  resetSampleScoreHistory,
} from '../utils/scoreHistory';

interface ScoreHistoryProps {
  currentResult: ATSAnalysisResult | null;
  currentResumeData: ResumeData;
  onRestoreResumeData?: (data: ResumeData) => void;
  onGoToBuilder?: () => void;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  currentResult,
  currentResumeData,
  onRestoreResumeData,
  onGoToBuilder,
}) => {
  const [history, setHistory] = useState<ScoreHistoryEntry[]>([]);
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [newVersionNotes, setNewVersionNotes] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [compareIdA, setCompareIdA] = useState<string | null>(null);
  const [compareIdB, setCompareIdB] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Load history from local storage on mount
  useEffect(() => {
    const loaded = getScoreHistory();
    setHistory(loaded);
  }, []);

  // Set default version name when currentResult or history changes
  useEffect(() => {
    if (currentResult) {
      setNewVersionName(`Version ${history.length + 1} - ${currentResult.grade} Grade (${currentResult.overallScore}%)`);
    }
  }, [currentResult, history.length]);

  const handleSaveCurrentSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResult) return;

    const label = newVersionName.trim() || `Version ${history.length + 1}`;
    const updated = addScoreEntry(
      currentResult,
      label,
      currentResumeData,
      newVersionNotes
    );
    setHistory(updated);
    setNewVersionNotes('');
    setSaveSuccessMsg(`Saved snapshot "${label}" to Local Storage!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleStartEditing = (entry: ScoreHistoryEntry) => {
    setEditingId(entry.id);
    setEditName(entry.versionName);
    setEditNotes(entry.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = updateScoreEntry(id, {
      versionName: editName,
      notes: editNotes,
    });
    setHistory(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = deleteScoreEntry(id);
    setHistory(updated);
    if (compareIdA === id) setCompareIdA(null);
    if (compareIdB === id) setCompareIdB(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all score history from Local Storage?')) {
      const updated = clearScoreHistory();
      setHistory(updated);
      setCompareIdA(null);
      setCompareIdB(null);
    }
  };

  const handleResetSample = () => {
    const updated = resetSampleScoreHistory();
    setHistory(updated);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATS_Score_History_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate improvement metrics
  // Sort entries chronologically (oldest first for chart)
  const sortedChronological = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const initialScore = sortedChronological.length > 0 ? sortedChronological[0].overallScore : 0;
  const latestScore = sortedChronological.length > 0 ? sortedChronological[sortedChronological.length - 1].overallScore : 0;
  const highestScore = sortedChronological.length > 0 ? Math.max(...sortedChronological.map((e) => e.overallScore)) : 0;
  const scoreImprovement = latestScore - initialScore;

  // Selected comparison entries
  const entryA = history.find((e) => e.id === compareIdA);
  const entryB = history.find((e) => e.id === compareIdB);

  // Prepare data for Recharts line chart
  const chartData = sortedChronological.map((item, index) => ({
    version: `v${index + 1}`,
    name: item.versionName,
    shortName: item.versionName.length > 18 ? `${item.versionName.slice(0, 18)}...` : item.versionName,
    score: item.overallScore,
    grade: item.grade,
    impact: item.categoryScores.impactAndMetrics,
    keywords: item.categoryScores.keywordMatch,
    formatting: item.categoryScores.formattingATS,
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#11121a] border border-red-900/80 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 z-50 max-w-xs">
          <div className="font-bold text-white flex items-center justify-between gap-3 font-space">
            <span className="truncate">{data.name}</span>
            <span className="text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-950 border border-red-800">{data.score}%</span>
          </div>
          <div className="text-[10px] text-zinc-400 flex justify-between">
            <span>Grade: {data.grade}</span>
            <span>{data.date}</span>
          </div>
          <div className="border-t border-zinc-800/80 pt-1.5 text-[10px] space-y-0.5">
            <div className="flex justify-between text-emerald-400">
              <span>Impact & Metrics:</span>
              <span className="font-bold">{data.impact}%</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>Keyword Match:</span>
              <span className="font-bold">{data.keywords}%</span>
            </div>
            <div className="flex justify-between text-blue-400">
              <span>Formatting ATS:</span>
              <span className="font-bold">{data.formatting}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Local Storage Status */}
      <div className="bg-[#161822]/90 border border-red-900/40 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-950/80 border border-red-800/60 text-red-400">
                <HistoryIcon size={20} />
              </span>
              <h2 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <span>ATS Score History & Improvement Tracker</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-space pl-11">
              All score versions are saved securely in your browser's <code className="text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/40 font-mono">localStorage</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportJSON}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Export history as JSON file"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleResetSample}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-all"
              title="Reset with sample tracking sequence"
            >
              <RotateCcw size={13} />
              <span>Load Sample History</span>
            </button>

            <button
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          
          <div className="p-3.5 bg-[#0e0f16] rounded-xl border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Versions Tracked</span>
              <Layers size={13} className="text-zinc-500" />
            </div>
            <div className="text-2xl font-bold font-space text-white mt-1">
              {history.length}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Saved in localStorage
            </div>
          </div>

          <div className="p-3.5 bg-[#0e0f16] rounded-xl border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Starting Score</span>
              <Clock size={13} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-space text-amber-400 mt-1">
              {initialScore}%
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Initial draft scan
            </div>
          </div>

          <div className="p-3.5 bg-[#0e0f16] rounded-xl border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Highest Score</span>
              <Award size={13} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-space text-emerald-400 mt-1">
              {highestScore}%
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Peak ATS alignment
            </div>
          </div>

          <div className="p-3.5 bg-[#0e0f16] rounded-xl border border-red-900/40 bg-gradient-to-br from-red-950/30 to-transparent flex flex-col justify-between">
            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Total Improvement</span>
              <TrendingUp size={13} className="text-red-400" />
            </div>
            <div className={`text-2xl font-bold font-space mt-1 flex items-center gap-1 ${
              scoreImprovement >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {scoreImprovement >= 0 ? `+${scoreImprovement}` : scoreImprovement}%
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {scoreImprovement >= 0 ? '▲ Score increase' : '▼ Score decline'}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Save Current Analysis Version Box */}
      {currentResult && (
        <div className="bg-[#161822]/90 border border-emerald-900/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold font-cinzel text-white">
                Record Current Scan Version to Local Storage
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              Current ATS Score: {currentResult.overallScore}% ({currentResult.grade})
            </span>
          </div>

          <form onSubmit={handleSaveCurrentSnapshot} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Version Label / Name
                </label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g., Version 3 - Added Action Verbs & Metrics"
                  className="w-full bg-[#0e0f16] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-space"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Optional Notes / Changelog
                </label>
                <input
                  type="text"
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  placeholder="e.g., Fixed missing Kubernetes keyword, added 3 metrics"
                  className="w-full bg-[#0e0f16] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-space"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                <Info size={12} className="text-zinc-500" />
                <span>Stores complete ATS metrics & resume snapshot in browser local storage</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold font-space bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 transition-all"
              >
                <Save size={14} />
                <span>Save Snapshot</span>
              </button>
            </div>
          </form>

          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 font-mono flex items-center gap-2"
            >
              <Check size={14} />
              <span>{saveSuccessMsg}</span>
            </motion.div>
          )}
        </div>
      )}

      {/* 3. Score Progression Graph / Bar Timeline */}
      {sortedChronological.length > 0 && (
        <div className="bg-[#161822]/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <h3 className="text-sm font-bold font-cinzel text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" />
              <span>Visual ATS Score Growth Curve (Recharts)</span>
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"></span>
                <span>Overall ATS Score</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                Target: 80%+
              </span>
            </div>
          </div>

          {/* Recharts Interactive Line Chart */}
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="version" 
                  stroke="#71717a" 
                  tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#a1a1aa' }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#71717a" 
                  tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#a1a1aa' }} 
                />
                <Tooltip content={<CustomChartTooltip />} />
                <ReferenceLine 
                  y={80} 
                  label={{ value: 'Target 80%', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ef4444', stroke: '#161822', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 space-y-3">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
              Chronological Breakdown
            </h4>
            {sortedChronological.map((item, idx) => {
              const isLatest = idx === sortedChronological.length - 1;
              const prevItem = idx > 0 ? sortedChronological[idx - 1] : null;
              const diff = prevItem ? item.overallScore - prevItem.overallScore : 0;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-space">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white truncate max-w-xs md:max-w-md">
                        {item.versionName}
                      </span>
                      {isLatest && (
                        <span className="text-[10px] font-mono bg-red-950/80 text-red-400 border border-red-800/60 px-2 py-0.2 rounded">
                          Latest
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      {prevItem && (
                        <span className={`text-[11px] font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {diff >= 0 ? `+${diff}` : diff} pts
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.overallScore >= 80
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : item.overallScore >= 65
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.overallScore}% ({item.grade})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full bg-[#0e0f16] h-3.5 rounded-full overflow-hidden p-0.5 border border-zinc-800/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.overallScore}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        item.overallScore >= 80
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-400'
                          : item.overallScore >= 65
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-400'
                          : 'bg-gradient-to-r from-red-700 to-red-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Side-By-Side Version Comparison Tool */}
      {history.length >= 2 && (
        <div className="bg-[#161822]/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-400" />
              <h3 className="text-sm font-bold font-cinzel text-white">
                Side-by-Side Version Comparison
              </h3>
            </div>
            <button
              onClick={() => setIsComparing(!isComparing)}
              className="text-xs font-mono text-blue-400 hover:text-blue-300 underline"
            >
              {isComparing ? 'Hide Comparison' : 'Compare 2 Versions'}
            </button>
          </div>

          {isComparing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Version A Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Select Baseline Version (Version A)
                  </label>
                  <select
                    value={compareIdA || ''}
                    onChange={(e) => setCompareIdA(e.target.value || null)}
                    className="w-full bg-[#0e0f16] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-space focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Choose Version A --</option>
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.versionName} ({h.overallScore}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Version B Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Select Improved Version (Version B)
                  </label>
                  <select
                    value={compareIdB || ''}
                    onChange={(e) => setCompareIdB(e.target.value || null)}
                    className="w-full bg-[#0e0f16] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-space focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Choose Version B --</option>
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.versionName} ({h.overallScore}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Output Table */}
              {entryA && entryB && (
                <div className="p-4 bg-[#0e0f16] rounded-xl border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-2 font-bold text-zinc-300 border-b border-zinc-800 pb-2 text-[11px]">
                    <div>Metric Category</div>
                    <div className="text-center text-amber-400">{entryA.versionName}</div>
                    <div className="text-center text-emerald-400">{entryB.versionName}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Overall ATS Score</div>
                    <div className="text-center font-bold text-white">{entryA.overallScore}% ({entryA.grade})</div>
                    <div className="text-center font-bold text-white flex items-center justify-center gap-1">
                      <span>{entryB.overallScore}% ({entryB.grade})</span>
                      <span className={`text-[10px] ${
                        entryB.overallScore - entryA.overallScore >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        ({entryB.overallScore - entryA.overallScore >= 0 ? '+' : ''}{entryB.overallScore - entryA.overallScore})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Impact & Metrics</div>
                    <div className="text-center text-zinc-300">{entryA.categoryScores.impactAndMetrics}%</div>
                    <div className="text-center text-zinc-300">{entryB.categoryScores.impactAndMetrics}%</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Keyword Match</div>
                    <div className="text-center text-zinc-300">{entryA.categoryScores.keywordMatch}%</div>
                    <div className="text-center text-zinc-300">{entryB.categoryScores.keywordMatch}%</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Formatting ATS</div>
                    <div className="text-center text-zinc-300">{entryA.categoryScores.formattingATS}%</div>
                    <div className="text-center text-zinc-300">{entryB.categoryScores.formattingATS}%</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Brevity & Clarity</div>
                    <div className="text-center text-zinc-300">{entryA.categoryScores.brevityAndClarity}%</div>
                    <div className="text-center text-zinc-300">{entryB.categoryScores.brevityAndClarity}%</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-zinc-400">Errors Count</div>
                    <div className="text-center text-red-400">{entryA.mistakeCount} issues</div>
                    <div className="text-center text-emerald-400">{entryB.mistakeCount} issues</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Detailed History Log & Cards List */}
      <div className="bg-[#161822]/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <h3 className="text-sm font-bold font-cinzel text-white flex items-center gap-2">
            <FileText size={16} className="text-red-500" />
            <span>Saved Version Logs ({history.length})</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Sorted by newest first</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-mono text-xs space-y-3">
            <AlertCircle size={28} className="mx-auto text-zinc-600" />
            <p>No score versions stored in Local Storage yet.</p>
            <p className="text-zinc-600">Run an ATS scan and save a snapshot to track improvement over time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => {
              const isEditing = editingId === entry.id;
              const dateStr = new Date(entry.timestamp).toLocaleString();

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#0e0f16] border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/50 pb-3">
                    
                    {/* Title & Date */}
                    <div className="space-y-1 flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[#161822] border border-red-800/60 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-space"
                          />
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Notes..."
                            className="w-full bg-[#161822] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none font-space"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white font-space">
                              {entry.versionName}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-500">
                              • {dateStr}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-xs text-zinc-400 font-space mt-1">
                              💬 {entry.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Score Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className={`text-base font-bold font-space ${
                          entry.overallScore >= 80
                            ? 'text-emerald-400'
                            : entry.overallScore >= 65
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}>
                          {entry.overallScore}%
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          Grade {entry.grade}
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-1 border-l border-zinc-800 pl-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(entry.id)}
                              className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 text-xs"
                              title="Save changes"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            {entry.resumeData && onRestoreResumeData && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Load resume data from "${entry.versionName}" into the Builder?`)) {
                                    onRestoreResumeData(entry.resumeData!);
                                    if (onGoToBuilder) onGoToBuilder();
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[11px] font-mono flex items-center gap-1"
                                title="Load this snapshot into builder"
                              >
                                <RotateCcw size={12} />
                                <span className="hidden sm:inline">Restore</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleStartEditing(entry)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs"
                              title="Edit label & notes"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-300 border border-red-900/40 text-xs"
                              title="Delete version from history"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Category Breakdown Mini Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[10px]">
                    <div className="p-1.5 rounded bg-[#141620] border border-zinc-800">
                      <span className="text-zinc-500 block">Impact & Metrics</span>
                      <span className="text-white font-bold">{entry.categoryScores.impactAndMetrics}%</span>
                    </div>

                    <div className="p-1.5 rounded bg-[#141620] border border-zinc-800">
                      <span className="text-zinc-500 block">Keyword Match</span>
                      <span className="text-white font-bold">{entry.categoryScores.keywordMatch}%</span>
                    </div>

                    <div className="p-1.5 rounded bg-[#141620] border border-zinc-800">
                      <span className="text-zinc-500 block">Formatting ATS</span>
                      <span className="text-white font-bold">{entry.categoryScores.formattingATS}%</span>
                    </div>

                    <div className="p-1.5 rounded bg-[#141620] border border-zinc-800">
                      <span className="text-zinc-500 block">Brevity & Clarity</span>
                      <span className="text-white font-bold">{entry.categoryScores.brevityAndClarity}%</span>
                    </div>

                    <div className="p-1.5 rounded bg-[#141620] border border-zinc-800">
                      <span className="text-zinc-500 block">Detected Errors</span>
                      <span className="text-red-400 font-bold">{entry.mistakeCount} issues</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
