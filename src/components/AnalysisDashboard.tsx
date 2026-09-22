import React, { useState } from 'react';
import { LegalAnalysis, AnalyzedClause, ClauseRisk } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Briefcase,
  Copy,
  Check,
  Search,
  BookOpen,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  FileCheck,
  Printer,
  Download,
  Gavel,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Users,
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: LegalAnalysis;
  onAskQuestionAboutDoc: (question: string) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onAskQuestionAboutDoc,
}) => {
  const [activeTab, setActiveTab] = useState<'clauses' | 'deadlines' | 'attorney' | 'summary'>('clauses');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [onlyWithRedline, setOnlyWithRedline] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [summaryMode, setSummaryMode] = useState<'executive' | 'eli5'>('executive');
  const [copiedKit, setCopiedKit] = useState(false);
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);
  const [copiedRecommendationIdx, setCopiedRecommendationIdx] = useState<number | null>(null);
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});

  const toggleClause = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper for risk badge styling
  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'severe':
      case 'high':
      case 'high risk':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          dot: 'bg-rose-600',
          label: 'High Risk',
        };
      case 'moderate':
      case 'caution':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          label: 'Caution',
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Standard / Safe',
        };
    }
  };

  // Clause count stats
  const totalClauses = analysis.clauses.length;
  const highRiskCount = analysis.clauses.filter((c) => c.riskLevel === 'High Risk').length;
  const cautionCount = analysis.clauses.filter((c) => c.riskLevel === 'Caution').length;
  const safeCount = analysis.clauses.filter((c) => c.riskLevel === 'Safe').length;
  const redlinesCount = analysis.clauses.filter((c) => Boolean(c.recommendationOrRedline)).length;

  // Filter clauses
  const filteredClauses = analysis.clauses.filter((clause) => {
    const matchesRisk =
      selectedRiskFilter === 'all' ||
      clause.riskLevel.toLowerCase().includes(selectedRiskFilter.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      clause.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    const matchesRedline = !onlyWithRedline || Boolean(clause.recommendationOrRedline);
    const matchesSearch =
      !searchQuery ||
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.simplifiedExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.originalExcerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesCategory && matchesRedline && matchesSearch;
  });

  // Extract unique categories
  const categories = Array.from(new Set(analysis.clauses.map((c) => c.category)));

  // Copy attorney prep kit
  const handleCopyAttorneyKit = () => {
    const kitText = `LEGAL CONSULTATION PREPARATION BRIEF
Document: ${analysis.title} (${analysis.documentType})
Overall Risk Score: ${analysis.overallRiskScore}/100 (${analysis.riskLevel})
Jurisdiction: ${analysis.governingLawDetected || 'Not Specified'}

SITUATION SUMMARY:
${analysis.attorneyConsultationKit.briefSituation}

TARGETED QUESTIONS TO ASK ATTORNEY:
${analysis.attorneyConsultationKit.topQuestionsForAttorney.map((q, i) => `${i + 1}. ${q}`).join('\n')}

CRITICAL RED FLAGS TO SCRUTINIZE:
${analysis.attorneyConsultationKit.potentialRedFlagsToReview.map((rf) => `- ${rf}`).join('\n')}

ACTIONABLE NEGOTIATION / COUNTER POINTS:
${analysis.attorneyConsultationKit.recommendedNegotiationPoints.map((p) => `- ${p}`).join('\n')}

Generated via LexiSense Legal Intelligence Assistant. For informational and consultation preparation purposes.`;

    navigator.clipboard.writeText(kitText);
    setCopiedKit(true);
    setTimeout(() => setCopiedKit(false), 2500);
  };

  // Copy individual redline amendment
  const handleCopyRedline = (clauseId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(clauseId);
    setTimeout(() => setCopiedClauseId(null), 2500);
  };

  // Copy recommendation
  const handleCopyRecommendation = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecommendationIdx(index);
    setTimeout(() => setCopiedRecommendationIdx(null), 2500);
  };

  // Print report
  const handlePrintReport = () => {
    window.print();
  };

  // Download complete legal dossier as Markdown file
  const handleDownloadMarkdownReport = () => {
    const lines = [
      `# Legal Document Audit Dossier: ${analysis.title}`,
      `**Document Type:** ${analysis.documentType}`,
      `**Jurisdiction / Governing Law:** ${analysis.governingLawDetected || 'General'}`,
      `**Parties Identified:** ${analysis.partiesDetected?.join(', ') || 'Not explicitly named'}`,
      `**Overall Risk Score:** ${analysis.overallRiskScore} / 100 (Grade: ${gradeInfo.grade} - ${gradeInfo.text})`,
      `**Risk Level:** ${analysis.riskLevel}`,
      '',
      '---',
      '## Executive Summary',
      analysis.executiveSummary,
      '',
      '### Simple Analogy (ELI5)',
      analysis.eli5Summary,
      '',
      '---',
      '## Top Actionable Recommendations & Redlines',
      ...strategicSuggestions.map((s, i) => `${i + 1}. ${s}`),
      '',
      '---',
      '## Key Clauses & Redline Amendments',
      ...analysis.clauses.map((c, i) => [
        `### ${i + 1}. ${c.title} [Risk: ${c.riskLevel}]`,
        `**Category:** ${c.category} | **Urgency:** ${c.urgency || 'Review'}`,
        `> **Original Excerpt:**`,
        `> "${c.originalExcerpt}"`,
        '',
        `**Plain English Explanation:** ${c.simplifiedExplanation}`,
        c.recommendationOrRedline ? `**Proposed Redline / Counter-Language:**\n\`\`\`\n${c.recommendationOrRedline}\n\`\`\`` : '',
        c.counterLanguageRationale ? `**Rationale:** ${c.counterLanguageRationale}` : '',
        '',
      ].join('\n')),
      '---',
      '## Attorney Consultation Preparation Kit',
      `**Situation Overview:** ${analysis.attorneyConsultationKit.briefSituation}`,
      '',
      '### Questions to Ask a Lawyer to Save Billable Hours:',
      ...(analysis.attorneyConsultationKit.topQuestionsForAttorney || []).map((q: string, i: number) => `${i + 1}. ${q}`),
      '',
      '### Red Flags to Review with Counsel:',
      ...(analysis.attorneyConsultationKit.potentialRedFlagsToReview || []).map((rf: string) => `- ${rf}`),
      '',
      '---',
      '*Notice: Generated by LexiSense Legal Document Assistant. For educational and consultation preparation purposes only. Does not constitute formal legal representation.*'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = (analysis.title || 'legal_document').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.download = `${sanitizedTitle}_legal_audit_dossier.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Risk gauge color
  const getRiskMeterColor = (score: number) => {
    if (score >= 70) return 'text-rose-600 stroke-rose-600';
    if (score >= 40) return 'text-amber-600 stroke-amber-600';
    return 'text-emerald-600 stroke-emerald-600';
  };

  const getRiskGrade = (score: number) => {
    if (score >= 80) return { grade: 'D-', text: 'Severe Liability Exposure' };
    if (score >= 60) return { grade: 'C', text: 'Significant Traps Present' };
    if (score >= 35) return { grade: 'B', text: 'Moderate Disproportion' };
    return { grade: 'A', text: 'Balanced Standard Agreement' };
  };

  const gradeInfo = getRiskGrade(analysis.overallRiskScore);

  // Recommendations to display
  const strategicSuggestions = analysis.topActionableRecommendations && analysis.topActionableRecommendations.length > 0
    ? analysis.topActionableRecommendations
    : analysis.attorneyConsultationKit.recommendedNegotiationPoints;

  return (
    <div className="space-y-6">
      {/* Top Legal Intelligence Header: Score, Metadata & Verdict */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Institutional Bar */}
        <div className="bg-slate-900 text-white px-5 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-300 font-serif tracking-wider uppercase text-[11px] flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5 text-amber-400" />
              Contract Audit Dossier
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium">{analysis.documentType}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            {analysis.governingLawDetected && (
              <span className="flex items-center gap-1 text-slate-300">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                {analysis.governingLawDetected}
              </span>
            )}
            <button
              id="download-dossier-btn"
              onClick={handleDownloadMarkdownReport}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700"
              title="Download structured Markdown legal dossier"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Dossier (.md)</span>
            </button>
            <button
              id="print-dossier-btn"
              onClick={handlePrintReport}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-slate-300 px-2 py-1"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Score & Verdict Row */}
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Score Meter */}
          <div className="lg:col-span-4 flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${getRiskMeterColor(analysis.overallRiskScore)} stroke-current transition-all duration-1000 ease-out`}
                  strokeDasharray={`${analysis.overallRiskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
                  {analysis.overallRiskScore}
                </span>
                <span className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">
                  / 100 Risk
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    getRiskBadge(analysis.riskLevel).bg
                  }`}
                >
                  Grade {gradeInfo.grade} &bull; {analysis.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-tight">
                {gradeInfo.text}
              </p>
              <div className="mt-2 text-[11px] text-slate-700 flex items-center gap-2">
                <span><strong>{highRiskCount}</strong> High Risk</span>
                <span>&bull;</span>
                <span><strong>{redlinesCount}</strong> Redlines</span>
              </div>
            </div>
          </div>

          {/* Right: Title & Executive Bottom Line */}
          <div className="lg:col-span-8 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {analysis.partiesDetected && analysis.partiesDetected.length > 0 && (
                  <span className="text-[11px] text-slate-700 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                    <Users className="w-3 h-3 text-slate-700" />
                    Parties: {analysis.partiesDetected.join(' vs. ')}
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight font-serif">
                {analysis.title}
              </h2>
            </div>

            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-slate-900">Executive Takeaway: </strong>
                {analysis.oneSentenceSummary}
              </div>
            </div>
          </div>
        </div>

        {/* Curated Strategic Recommendations Showcase */}
        {strategicSuggestions && strategicSuggestions.length > 0 && (
          <div className="border-t border-slate-200/80 bg-slate-50/60 p-5 md:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Priority Actionable Counter-Suggestions &amp; Redline Playbook
                </h3>
              </div>
              <span className="text-[11px] text-slate-700">
                Filtered high-impact points to negotiate or strike
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {strategicSuggestions.slice(0, 6).map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-normal">
                      {rec}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-700 uppercase">
                      Counter-Point
                    </span>
                    <button
                      onClick={() => handleCopyRecommendation(idx, rec)}
                      className="text-[11px] font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                      title="Copy suggestion to clipboard"
                    >
                      {copiedRecommendationIdx === idx ? (
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Grounded Question Prompts */}
        <div className="px-5 py-3 border-t border-slate-200/80 bg-white flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-700" />
            Suggested Document Inquiries:
          </span>
          {[
            'Can they raise rent or service fees unilaterally?',
            'What is the exact penalty for early exit or cancellation?',
            'Is there mandatory binding arbitration or jury trial waiver?',
            'Who retains deliverables and intellectual property rights?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestionAboutDoc(prompt)}
              className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          id="tab-btn-clauses"
          onClick={() => setActiveTab('clauses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'clauses'
              ? 'bg-slate-950 text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          Clause Inspector &amp; Redlines ({analysis.clauses.length})
        </button>

        <button
          id="tab-btn-summary"
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-slate-950 text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Plain-English &amp; Traps
        </button>

        <button
          id="tab-btn-deadlines"
          onClick={() => setActiveTab('deadlines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'deadlines'
              ? 'bg-slate-950 text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Deadlines &amp; Requirements ({analysis.obligationsAndDeadlines.length})
        </button>

        <button
          id="tab-btn-attorney"
          onClick={() => setActiveTab('attorney')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'attorney'
              ? 'bg-slate-950 text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          Attorney Briefing Kit
        </button>
      </div>

      {/* TAB 1: CLAUSE-BY-CLAUSE INSPECTOR & REDLINE AMENDMENT VIEWER */}
      {activeTab === 'clauses' && (
        <div className="space-y-4">
          {/* Smart Suggestion Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input
                  type="text"
                  placeholder="Filter clauses, legal terms, excerpts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Toggle: Redline Suggestions Only */}
                <button
                  id="filter-redlines-only-btn"
                  onClick={() => setOnlyWithRedline(!onlyWithRedline)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    onlyWithRedline
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Redline Suggestions Only ({redlinesCount})</span>
                </button>

                {/* Risk Filter Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: 'all', label: `All (${totalClauses})` },
                    { id: 'high', label: `High Risk (${highRiskCount})` },
                    { id: 'caution', label: `Caution (${cautionCount})` },
                    { id: 'safe', label: `Safe (${safeCount})` },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRiskFilter(item.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedRiskFilter === item.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    aria-label="Filter clauses by category"
                    className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border-0 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Clause Cards List */}
          <div className="space-y-3">
            {filteredClauses.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-700 text-xs space-y-2">
                <p>No clauses match the current filter selection.</p>
                <button
                  onClick={() => {
                    setSelectedRiskFilter('all');
                    setSelectedCategoryFilter('all');
                    setOnlyWithRedline(false);
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredClauses.map((clause: AnalyzedClause) => {
                const badge = getRiskBadge(clause.riskLevel);
                const isExpanded = expandedClauses[clause.id] ?? true;

                return (
                  <div
                    key={clause.id}
                    className={`bg-white rounded-xl border overflow-hidden shadow-xs transition-all ${
                      clause.riskLevel === 'High Risk'
                        ? 'border-rose-200/90'
                        : clause.riskLevel === 'Caution'
                        ? 'border-amber-200/90'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Clause Header */}
                    <div
                      onClick={() => toggleClause(clause.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${badge.dot}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {clause.title}
                            </h4>
                            {clause.urgency && (
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {clause.urgency}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-700 font-medium">{clause.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-700" />
                        )}
                      </div>
                    </div>

                    {/* Clause Body */}
                    {isExpanded && (
                      <div className="p-4 pt-3 border-t border-slate-100 space-y-3.5 text-xs sm:text-sm">
                        {/* Plain English Translation */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                            Plain-Language Explanation (What it actually means for you):
                          </span>
                          <p className="text-slate-800 leading-relaxed font-normal">
                            {clause.simplifiedExplanation}
                          </p>
                        </div>

                        {/* Original Contract Excerpt */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                            Original Contract Language:
                          </span>
                          <blockquote className="p-3 bg-slate-100/80 border-l-3 border-slate-400 rounded text-slate-800 text-xs font-mono leading-relaxed">
                            "{clause.originalExcerpt}"
                          </blockquote>
                        </div>

                        {/* Redline Amendment / Counter-Clause Recommendation */}
                        {clause.recommendationOrRedline && (
                          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                Fair Counter-Proposal / Redline Amendment:
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyRedline(clause.id, clause.recommendationOrRedline || '')
                                }
                                className="text-[11px] font-semibold bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {copiedClauseId === clause.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Copied Amendment
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy Redline Language
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-amber-950 text-xs leading-relaxed font-mono bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                              {clause.recommendationOrRedline}
                            </p>

                            {clause.counterLanguageRationale && (
                              <p className="text-[11px] text-amber-900/80 italic">
                                <strong>Rationale: </strong>
                                {clause.counterLanguageRationale}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLAIN-ENGLISH SUMMARIES & PROS/CONS */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Toggle between Executive Summary and ELI5 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Document Synthesis</h3>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSummaryMode('executive')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    summaryMode === 'executive'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Executive Summary
                </button>
                <button
                  onClick={() => setSummaryMode('eli5')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    summaryMode === 'eli5'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  "Explain Like I'm 5"
                </button>
              </div>
            </div>

            {summaryMode === 'executive' ? (
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {analysis.executiveSummary}
              </div>
            ) : (
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Simple Real-World Analogy:
                </div>
                <p>{analysis.eli5Summary}</p>
              </div>
            )}
          </div>

          {/* Pros vs. Traps Bento Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pros */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold">Standard or Favorable Provisions</h4>
              </div>
              <ul className="space-y-2.5">
                {analysis.keyPros.map((pro, index) => (
                  <li key={index} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Traps / Cons */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h4 className="text-sm font-bold">Lopsided Traps &amp; High-Exposure Terms</h4>
              </div>
              <ul className="space-y-2.5">
                {analysis.keyCons.map((con, index) => (
                  <li key={index} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OBLIGATIONS & DEADLINES CHECKLIST */}
      {activeTab === 'deadlines' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Contractual Deadlines &amp; Operating Obligations
              </h3>
              <p className="text-xs text-slate-700">
                Never miss strict notice windows, price escalations, or deliverable conditions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {analysis.obligationsAndDeadlines.map((item, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      item.importance === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.importance === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {item.timingOrAmount && (
                  <div className="sm:text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/70 inline-block font-mono">
                      {item.timingOrAmount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ATTORNEY CONSULTATION BRIEFING KIT */}
      {activeTab === 'attorney' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Attorney Consultation Briefing Kit</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Saves Billable Consultation Hours
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Take this structured dossier into your meeting to focus directly on key risks and leverage.
              </p>
            </div>

            <button
              id="copy-attorney-kit-btn"
              onClick={handleCopyAttorneyKit}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              {copiedKit ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied Briefing Dossier!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Briefing Dossier
                </>
              )}
            </button>
          </div>

          {/* Section 1: Situation Brief */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Your Situation Summary for Counsel:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {analysis.attorneyConsultationKit.briefSituation}
            </p>
          </div>

          {/* Section 2: Essential Questions to Ask */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-700" />
              Targeted Legal Questions to Ask Your Lawyer:
            </h4>
            <div className="space-y-2">
              {analysis.attorneyConsultationKit.topQuestionsForAttorney.map((question, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3 shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Red Flags to Scrutinize */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/60">
              <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Clauses for Lawyer to Scrutinize:
              </h5>
              <ul className="space-y-2">
                {analysis.attorneyConsultationKit.potentialRedFlagsToReview.map((rf, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
              <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Realistic Negotiation Levers:
              </h5>
              <ul className="space-y-2">
                {analysis.attorneyConsultationKit.recommendedNegotiationPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
