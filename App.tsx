import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MotionBackground } from './components/MotionBackground';
import { ResumeInputTab } from './components/ResumeInputTab';
import { AnalysisResults } from './components/AnalysisResults';
import { ResumeEditor } from './components/ResumeEditor';
import { ScoreHistory } from './components/ScoreHistory';
import { ATSPreviewExport } from './components/ATSPreviewExport';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { ResumeData, ATSAnalysisResult, SampleResume, MistakeItem } from './types';
import { analyzeResumeLocally, formatResumeDataToText } from './utils/atsParser';
import { addScoreEntry } from './utils/scoreHistory';

export default function App() {
  // Application State
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUMES[0].data);
  const [targetJD, setTargetJD] = useState<string>(SAMPLE_RESUMES[0].targetJD || '');
  const [activeTab, setActiveTab] = useState<'input' | 'report' | 'builder' | 'history' | 'export'>('report');
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeFixMistake, setActiveFixMistake] = useState<MistakeItem | null>(null);

  // Perform Analysis using Unique Pro ATS Neural Engine 4.0
  const performAnalysis = async (customData?: ResumeData, customJD?: string) => {
    setIsAnalyzing(true);
    const dataToUse = customData || resumeData;
    const jdToUse = customJD !== undefined ? customJD : targetJD;

    // Simulate instant high-performance neural scan delay (300ms for realistic user feedback)
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const result = analyzeResumeLocally(dataToUse, jdToUse);
      setAnalysisResult(result);

      // Record snapshot to score history
      if (result && result.overallScore !== undefined) {
        const candidateName = dataToUse.contact?.fullName || 'Candidate';
        const roleName = dataToUse.experience?.[0]?.role || 'Resume';
        const label = `${roleName} Scan (${result.overallScore}%)`;
        addScoreEntry(result, label, dataToUse, `Unique ATS 4.0 scan for ${candidateName}`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
      setActiveTab('report');
    }
  };

  // Run initial analysis on app load
  useEffect(() => {
    performAnalysis();
  }, []);

  // Handler for sample selection
  const handleSelectSample = (sample: SampleResume) => {
    setResumeData(sample.data);
    if (sample.targetJD) setTargetJD(sample.targetJD);
    performAnalysis(sample.data, sample.targetJD);
  };

  // Handle going to interactive fixer for a specific mistake
  const handleGoToFixer = (mistake?: MistakeItem) => {
    if (mistake) {
      setActiveFixMistake(mistake);
    }
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen text-[#e0e2ec] flex flex-col font-['Outfit',sans-serif]">
      {/* Motion Background with Moving Symbols & Floating Particles */}
      <MotionBackground />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectSample={handleSelectSample}
        hasAnalysis={!!analysisResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-6">
        
        {activeTab === 'input' && (
          <ResumeInputTab
            resumeData={resumeData}
            setResumeData={setResumeData}
            targetJD={targetJD}
            setTargetJD={setTargetJD}
            onAnalyze={() => performAnalysis()}
            isAnalyzing={isAnalyzing}
            onSelectSample={handleSelectSample}
          />
        )}

        {activeTab === 'report' && analysisResult && (
          <AnalysisResults
            result={analysisResult}
            onGoToFixer={handleGoToFixer}
            onGoToHistory={() => setActiveTab('history')}
            resumeData={resumeData}
            setResumeData={setResumeData}
            targetJD={targetJD}
            onReAnalyze={(newData) => performAnalysis(newData)}
            aiPowered={true}
          />
        )}

        {activeTab === 'builder' && (
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
            targetJD={targetJD}
            activeFixMistake={activeFixMistake}
            onFinishFixing={() => performAnalysis()}
          />
        )}

        {activeTab === 'history' && (
          <ScoreHistory
            currentResult={analysisResult}
            currentResumeData={resumeData}
            onRestoreResumeData={(data) => setResumeData(data)}
            onGoToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'export' && (
          <ATSPreviewExport resumeData={resumeData} />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print border-t border-red-900/30 bg-[#0e0f16]/90 py-6 px-4 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-white">RESUME CORRECT APP</span>
            <span>• 100% ATS Friendly Resume Optimizer</span>
          </div>

          <div>
            Powered by Unique Pro ATS Neural Engine 4.0
          </div>
        </div>
      </footer>
    </div>
  );
}
