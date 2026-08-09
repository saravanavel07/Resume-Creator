import { ScoreHistoryEntry, ATSAnalysisResult, ResumeData } from '../types';

const STORAGE_KEY = 'ats_resume_score_history';

// Default initial sample history entries if local storage is completely empty
const DEFAULT_INITIAL_HISTORY: ScoreHistoryEntry[] = [
  {
    id: 'hist_initial_1',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    versionName: 'Version 1 - Raw Unoptimized Draft',
    overallScore: 58,
    grade: 'D',
    categoryScores: {
      impactAndMetrics: 45,
      keywordMatch: 52,
      formattingATS: 65,
      brevityAndClarity: 70,
      skillsAndRelevance: 58,
    },
    mistakeCount: 9,
    candidateName: 'Alex Morgan',
    targetRole: 'Senior Software Engineer',
    notes: 'Initial scan with unformatted bullet points and missing JD keywords.',
  },
  {
    id: 'hist_initial_2',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    versionName: 'Version 2 - Rectified Keywords & Metrics',
    overallScore: 78,
    grade: 'B',
    categoryScores: {
      impactAndMetrics: 75,
      keywordMatch: 82,
      formattingATS: 80,
      brevityAndClarity: 85,
      skillsAndRelevance: 72,
    },
    mistakeCount: 4,
    candidateName: 'Alex Morgan',
    targetRole: 'Senior Software Engineer',
    notes: 'Added quantified metrics and aligned skill keywords with target JD.',
  },
];

/**
 * Retrieve score history from localStorage.
 */
export function getScoreHistory(): ScoreHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveScoreHistory(DEFAULT_INITIAL_HISTORY);
      return DEFAULT_INITIAL_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_INITIAL_HISTORY;
  } catch (err) {
    console.error('Error reading score history from localStorage:', err);
    return DEFAULT_INITIAL_HISTORY;
  }
}

/**
 * Persist array of ScoreHistoryEntry items to localStorage.
 */
export function saveScoreHistory(history: ScoreHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving score history to localStorage:', err);
  }
}

/**
 * Add a new score entry to history.
 */
export function addScoreEntry(
  result: ATSAnalysisResult,
  versionName: string,
  resumeData?: ResumeData,
  notes?: string
): ScoreHistoryEntry[] {
  const currentHistory = getScoreHistory();

  const newEntry: ScoreHistoryEntry = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    versionName: versionName.trim() || `Resume Version ${currentHistory.length + 1}`,
    overallScore: result.overallScore,
    grade: result.grade,
    categoryScores: { ...result.categoryScores },
    mistakeCount: result.mistakes?.length || 0,
    candidateName: resumeData?.contact?.fullName || 'Candidate',
    notes: notes || '',
    resumeData: resumeData ? JSON.parse(JSON.stringify(resumeData)) : undefined,
  };

  const updatedHistory = [newEntry, ...currentHistory]; // Newest first
  saveScoreHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Update an existing score history entry (e.g. edit label or notes).
 */
export function updateScoreEntry(
  id: string,
  updatedFields: Partial<Pick<ScoreHistoryEntry, 'versionName' | 'notes'>>
): ScoreHistoryEntry[] {
  const history = getScoreHistory();
  const updated = history.map((entry) => {
    if (entry.id === id) {
      return {
        ...entry,
        ...updatedFields,
      };
    }
    return entry;
  });
  saveScoreHistory(updated);
  return updated;
}

/**
 * Delete a single entry by ID.
 */
export function deleteScoreEntry(id: string): ScoreHistoryEntry[] {
  const history = getScoreHistory();
  const updated = history.filter((e) => e.id !== id);
  saveScoreHistory(updated);
  return updated;
}

/**
 * Clear all score history from localStorage.
 */
export function clearScoreHistory(): ScoreHistoryEntry[] {
  saveScoreHistory([]);
  return [];
}

/**
 * Reset to sample history.
 */
export function resetSampleScoreHistory(): ScoreHistoryEntry[] {
  saveScoreHistory(DEFAULT_INITIAL_HISTORY);
  return DEFAULT_INITIAL_HISTORY;
}
