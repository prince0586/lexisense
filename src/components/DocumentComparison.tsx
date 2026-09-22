import React, { useState } from 'react';
import { COMPARISON_PAIRS } from '../data/sampleDocuments';
import { ComparisonAnalysis } from '../types';
import {
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Scale,
  Copy,
  Check,
  Filter,
} from 'lucide-react';

interface DocumentComparisonProps {
  onRunComparison: (
    docA: { title: string; content: string },
    docB: { title: string; content: string }
  ) => Promise<void>;
  comparisonResult: ComparisonAnalysis | null;
  isLoading: boolean;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  onRunComparison,
  comparisonResult,
  isLoading,
}) => {
  const [docATitle, setDocATitle] = useState('Standard Mutual NDA (Option A)');
  const [docAContent, setDocAContent] = useState('');
  const [docBTitle, setDocBTitle] = useState('Vendor Unilateral NDA (Option B)');
  const [docBContent, setDocBContent] = useState('');
  const [diffFilter, setDiffFilter] = useState<'all' | 'docA' | 'docB' | 'neutral'>('all');
  const [copiedRecIdx, setCopiedRecIdx] = useState<number | null>(null);

  // Load sample pair
  const handleLoadSamplePair = (pairId: string) => {
    const pair = COMPARISON_PAIRS.find((p) => p.id === pairId);
    if (pair) {
      setDocATitle(pair.docA.title);
      setDocAContent(pair.docA.content);
      setDocBTitle(pair.docB.title);
      setDocBContent(pair.docB.content);
    }
  };

  const handleCompare = () => {
    if (!docAContent.trim() || !docBContent.trim()) return;
    onRunComparison(
      { title: docATitle || 'Document A', content: docAContent },
      { title: docBTitle || 'Document B', content: docBContent }
    );
  };

  const handleCopyRec = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecIdx(idx);
    setTimeout(() => setCopiedRecIdx(null), 2500);
  };

  const getFavorableBadge = (fav: string) => {
    if (fav.includes('Document A')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (fav.includes('Document B')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  // Filtered key differences
  const filteredDifferences = comparisonResult?.keyDifferences.filter((diff) => {
    if (diffFilter === 'docA') return diff.whichIsMoreFavorable.includes('Document A');
    if (diffFilter === 'docB') return diff.whichIsMoreFavorable.includes('Document B');
    if (diffFilter === 'neutral')
      return (
        !diff.whichIsMoreFavorable.includes('Document A') &&
        !diff.whichIsMoreFavorable.includes('Document B')
      );
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview & Pre-built Preset */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Comparative Contract Audit &amp; Redline Diff
              </h2>
              <p className="text-[11px] text-slate-400">
                Compare two drafts, competing vendor agreements, or amended policy terms side-by-side
              </p>
            </div>
          </div>

          {/* Quick Pre-fill */}
          <button
            id="load-sample-comparison-btn"
            onClick={() => handleLoadSamplePair('nda-comparison')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Load Sample: Mutual NDA vs. Vendor Aggressive NDA
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-5">
          {/* Dual Input Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Document A */}
            <div className="border border-blue-200/80 rounded-xl p-4 bg-blue-50/20 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="doc-a-title-input"
                  className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-4 h-4 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    A
                  </span>
                  Document A (Standard / Baseline)
                </label>
                <input
                  id="doc-a-title-input"
                  type="text"
                  value={docATitle}
                  onChange={(e) => setDocATitle(e.target.value)}
                  placeholder="Title (e.g. Standard NDA)"
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-800 w-48 text-right font-medium"
                />
              </div>
              <textarea
                id="doc-a-content-input"
                value={docAContent}
                onChange={(e) => setDocAContent(e.target.value)}
                placeholder="Paste text of Document A or first agreement version..."
                rows={8}
                className="w-full p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-y"
              />
            </div>

            {/* Document B */}
            <div className="border border-purple-200/80 rounded-xl p-4 bg-purple-50/20 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="doc-b-title-input"
                  className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-4 h-4 rounded bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                    B
                  </span>
                  Document B (Counter-Offer / Vendor Terms)
                </label>
                <input
                  id="doc-b-title-input"
                  type="text"
                  value={docBTitle}
                  onChange={(e) => setDocBTitle(e.target.value)}
                  placeholder="Title (e.g. Vendor NDA)"
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-800 w-48 text-right font-medium"
                />
              </div>
              <textarea
                id="doc-b-content-input"
                value={docBContent}
                onChange={(e) => setDocBContent(e.target.value)}
                placeholder="Paste text of Document B or proposed counter-agreement..."
                rows={8}
                className="w-full p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-y"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              id="run-comparison-btn"
              onClick={handleCompare}
              disabled={isLoading || !docAContent.trim() || !docBContent.trim()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                isLoading || !docAContent.trim() || !docBContent.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-950 hover:bg-slate-900 text-amber-300 cursor-pointer active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Comparing Agreements Across All Legal Dimensions...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4 text-amber-400" />
                  <span>Run Side-by-Side Comparison Audit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Comparative Analysis Verdict
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">
                  {comparisonResult.docATitle} vs. {comparisonResult.docBTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700 font-medium">Favors:</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    comparisonResult.favors.includes('A')
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : comparisonResult.favors.includes('B')
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {comparisonResult.favors}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Comparative Summary:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {comparisonResult.comparisonVerdict}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {comparisonResult.overallAssessment}
            </p>

            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Risk Profile Delta: </strong>
                {comparisonResult.riskDelta}
              </div>
            </div>
          </div>

          {/* Side-by-Side Clause Matrix with Filtering */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Dimension-by-Dimension Comparison Matrix
                </h4>
                <p className="text-[11px] text-slate-700">
                  {comparisonResult.keyDifferences.length} Major Legal Dimensions Evaluated
                </p>
              </div>

              {/* Filter Differences */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-700 px-1.5 uppercase">
                  Filter:
                </span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'docA', label: 'Favors Doc A' },
                  { id: 'docB', label: 'Favors Doc B' },
                  { id: 'neutral', label: 'Neutral' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDiffFilter(f.id as any)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                      diffFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredDifferences && filteredDifferences.length > 0 ? (
                filteredDifferences.map((diff, index) => (
                  <div key={index} className="p-5 hover:bg-slate-50/40 transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {diff.category}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getFavorableBadge(
                          diff.whichIsMoreFavorable
                        )}`}
                      >
                        More Favorable: {diff.whichIsMoreFavorable}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-lg">
                        <span className="text-[10px] font-bold text-blue-900 uppercase block mb-1">
                          Document A Approach:
                        </span>
                        <p className="text-slate-700 leading-relaxed font-normal">{diff.docASummary}</p>
                      </div>

                      <div className="p-3.5 bg-purple-50/40 border border-purple-100 rounded-lg">
                        <span className="text-[10px] font-bold text-purple-900 uppercase block mb-1">
                          Document B Approach:
                        </span>
                        <p className="text-slate-700 leading-relaxed font-normal">{diff.docBSummary}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-200 leading-relaxed">
                      <strong className="text-slate-900">Why it matters: </strong>
                      {diff.explanation}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-700">
                  No dimensions match the filter.
                </div>
              )}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strategic Recommendations &amp; Redline Guidance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {comparisonResult.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-2.5 text-xs text-slate-800"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>

                  <button
                    onClick={() => handleCopyRec(i, rec)}
                    className="text-[10px] text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0 cursor-pointer pt-0.5"
                    title="Copy recommendation"
                  >
                    {copiedRecIdx === i ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
