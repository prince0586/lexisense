import React, { useState, useEffect, useRef } from 'react';
import { Header, AppMode } from './components/Header';
import { DocumentInput } from './components/DocumentInput';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { DocumentComparison } from './components/DocumentComparison';
import { InteractiveQA } from './components/InteractiveQA';
import { RightsNavigator } from './components/RightsNavigator';
import { SAMPLE_DOCUMENTS, SampleDocument } from './data/sampleDocuments';
import { LegalAnalysis, ComparisonAnalysis, QAMessage } from './types';
import { generateDocumentHash } from './utils/legalMath';
import { AlertCircle, RefreshCw, FileCheck2, Scale, Zap } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('analyzer');
  const [documentText, setDocumentText] = useState<string>(SAMPLE_DOCUMENTS[0].content);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(SAMPLE_DOCUMENTS[0].id);
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  // Client-side cache for instant recall without LLM quota consumption
  const documentCacheRef = useRef<Map<string, LegalAnalysis>>(new Map());

  // Comparison State
  const [comparisonResult, setComparisonResult] = useState<ComparisonAnalysis | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Q&A State
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Document title for context
  const currentDocTitle =
    SAMPLE_DOCUMENTS.find((s) => s.id === selectedSampleId)?.title ||
    (analysis ? analysis.title : 'Current Legal Document');

  // Select sample
  const handleSelectSample = (sample: SampleDocument) => {
    setSelectedSampleId(sample.id);
    setDocumentText(sample.content);
    setAnalysisError(null);
    setQaMessages([]);

    // Check if we already cached this sample's analysis
    const docHash = generateDocumentHash(sample.content);
    const cached = documentCacheRef.current.get(docHash);
    if (cached) {
      setAnalysis(cached);
      setIsFromCache(true);
    } else {
      setAnalysis(null);
      setIsFromCache(false);
    }
  };

  // Analyze document with client-side cache check
  const handleAnalyze = async (fileData?: { mimeType: string; base64: string; fileName?: string }) => {
    if (!documentText.trim() && !fileData) return;

    // Check cache first for text input to deliver instant 0ms response and save quota
    if (!fileData && documentText.trim()) {
      const docHash = generateDocumentHash(documentText);
      const cached = documentCacheRef.current.get(docHash);
      if (cached) {
        setAnalysis(cached);
        setIsFromCache(true);
        setAnalysisError(null);
        return;
      }
    }

    setIsLoading(true);
    setAnalysisError(null);
    setIsFromCache(false);

    try {
      const response = await fetch('/api/legal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: documentText.trim(),
          fileData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze document.');
      }

      setAnalysis(data);

      // Save to client-side memory cache
      if (documentText.trim()) {
        const hash = generateDocumentHash(documentText);
        documentCacheRef.current.set(hash, data);
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'An error occurred while analyzing the document.');
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut listener: Cmd/Ctrl + Enter triggers document audit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (currentMode === 'analyzer' && !isLoading && documentText.trim()) {
          e.preventDefault();
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, isLoading, documentText]);

  // Run side-by-side comparison
  const handleRunComparison = async (
    docA: { title: string; content: string },
    docB: { title: string; content: string }
  ) => {
    setIsComparing(true);
    try {
      const response = await fetch('/api/legal/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docA, docB }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare documents.');
      }

      setComparisonResult(data);
    } catch (err: any) {
      alert(err.message || 'Failed to compare documents.');
    } finally {
      setIsComparing(false);
    }
  };

  // Interactive Q&A
  const handleAskQuestion = async (question: string) => {
    if (!documentText.trim() || !question.trim()) return;

    const userMsg: QAMessage = {
      id: String(Date.now()),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setQaMessages((prev) => [...prev, userMsg]);
    setIsAsking(true);

    try {
      const response = await fetch('/api/legal/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          question,
          chatHistory: qaMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process question.');
      }

      const assistantMsg: QAMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString(),
        relevantClauses: data.relevantClauses,
        suggestedFollowUps: data.suggestedNextSteps,
      };

      setQaMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: QAMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to retrieve answer. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setQaMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // Switch to QA tab from question prompt
  const handleAskQuestionAboutDoc = (question: string) => {
    setCurrentMode('qa');
    handleAskQuestion(question);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-slate-950 focus:text-amber-300 focus:rounded-xl focus:shadow-xl focus:border focus:border-amber-400/40 text-xs font-bold transition-all"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Region for status announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? 'Analyzing legal document, detecting clauses and risks. Please wait.'
          : analysis
          ? `Analysis complete for ${analysis.title}. Overall risk score is ${analysis.overallRiskScore} out of 100.`
          : ''}
      </div>

      {/* Header with Mode Navigation & Legal Disclaimer */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        hasDocumentLoaded={Boolean(documentText.trim())}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 outline-none"
      >
        {/* MODE 1: DOCUMENT ANALYZER */}
        {currentMode === 'analyzer' && (
          <div className="space-y-6">
            {/* Cache Hit Notification Pill */}
            {isFromCache && analysis && (
              <div
                role="status"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Instant Recall: Retrieved from verified in-memory session cache (0ms latency, zero tokens consumed)</span>
              </div>
            )}

            {/* Input Component */}
            <DocumentInput
              documentText={documentText}
              onDocumentTextChange={(text) => {
                setDocumentText(text);
                setSelectedSampleId(null);
                setAnalysis(null);
                setIsFromCache(false);
              }}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedSampleId={selectedSampleId}
              onSelectSample={handleSelectSample}
            />

            {/* Error Message */}
            {analysisError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-rose-900">Analysis Error</h4>
                  <p className="mt-0.5 text-rose-700">{analysisError}</p>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <AnalysisDashboard
                analysis={analysis}
                onAskQuestionAboutDoc={handleAskQuestionAboutDoc}
              />
            )}
          </div>
        )}

        {/* MODE 2: SIDE-BY-SIDE AGREEMENT COMPARISON */}
        {currentMode === 'compare' && (
          <DocumentComparison
            onRunComparison={handleRunComparison}
            comparisonResult={comparisonResult}
            isLoading={isComparing}
          />
        )}

        {/* MODE 3: INTERACTIVE DOCUMENT Q&A */}
        {currentMode === 'qa' && (
          <InteractiveQA
            documentText={documentText}
            documentTitle={currentDocTitle}
            onAskQuestion={handleAskQuestion}
            messages={qaMessages}
            isAsking={isAsking}
          />
        )}

        {/* MODE 4: RIGHTS & REMEDIES NAVIGATOR */}
        {currentMode === 'navigator' && <RightsNavigator />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Legal Document Navigator</span>
            <span>&bull;</span>
            <span>Educational &amp; Legal Empowerment AI Platform</span>
          </div>
          <div>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
