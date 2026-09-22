import React, { useState } from 'react';
import { LEGAL_TOPIC_GUIDES } from '../data/legalGuides';
import { LegalTopicGuide } from '../types';
import {
  Compass,
  FileText,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building,
  UserCheck,
  Briefcase,
  ShieldAlert,
  Send,
  Gavel,
  Landmark,
} from 'lucide-react';

interface ScenarioResult {
  scenarioSummary: string;
  legalPrinciples: string[];
  optionsAndRemedies: string[];
  stepByStepPlan: string[];
  customizableLetterTemplate: string;
  whenToHireLawyer: string[];
}

export const RightsNavigator: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<LegalTopicGuide>(LEGAL_TOPIC_GUIDES[0]);
  const [customScenario, setCustomScenario] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const scenarioPresets = [
    {
      title: 'Withheld Security Deposit',
      jurisdiction: 'California',
      text: 'My landlord in San Francisco withheld $1,200 from my $2,500 security deposit for normal wear and tear painting after 2 years. It has been 28 days and they sent no contractor invoices or itemized receipts.',
    },
    {
      title: 'Unpaid Client Invoice (Net 30 Overdue)',
      jurisdiction: 'New York',
      text: 'I completed and delivered full-stack web application deliverables to a corporate client 50 days ago under Net 30 terms. Client confirmed receipt in writing but accounts payable has gone silent and ignored multiple reminders.',
    },
    {
      title: 'Employer Overbroad IP & Non-Compete',
      jurisdiction: 'General US',
      text: 'My former tech employer is threatening legal action over an open-source side project I developed on my personal laptop during weekends, claiming their proprietary information agreement grants them perpetual ownership of all software I create.',
    },
    {
      title: 'Unlawful SaaS / Gym Auto-Renewal',
      jurisdiction: 'General US / FTC',
      text: 'An enterprise software vendor automatically renewed an annual subscription of $3,600 without sending the mandated 30-day advance notice, and refuses to refund my credit card when notified within 48 hours.',
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const handleRunScenario = async () => {
    if (!customScenario.trim()) return;
    setIsLoadingScenario(true);
    try {
      const res = await fetch('/api/legal/navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: customScenario,
          jurisdiction: jurisdiction || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to navigate scenario');
      setScenarioResult(data);
    } catch (err: any) {
      alert(err.message || 'Error navigating scenario');
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'Freelance':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 font-serif">
                Legal Rights &amp; Remedies Navigator
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                Navigate statutory rights, evaluate dispute remedies, and auto-draft binding legal demand letters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>Statutory Knowledge Base &amp; Formal Notice Generator</span>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive Custom Scenario Solver */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Describe Your Specific Dispute or Circumstance
            </h3>
          </div>
          <span className="text-[11px] text-slate-700 font-medium">
            Generates tailored remedies + formal legal notice
          </span>
        </div>

        {/* Instant Dispute Scenario Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
            Load High-Frequency Dispute Scenario:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {scenarioPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomScenario(preset.text);
                  setJurisdiction(preset.jurisdiction);
                }}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-left transition-all text-xs text-slate-800 flex flex-col justify-between cursor-pointer"
              >
                <div className="font-semibold text-slate-900 mb-1">{preset.title}</div>
                <div className="text-[10px] text-slate-700 flex items-center justify-between">
                  <span>{preset.jurisdiction}</span>
                  <span className="text-amber-800 font-medium">Apply &rarr;</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3">
              <label htmlFor="scenario-textarea" className="text-xs font-semibold text-slate-700 block mb-1">
                Dispute Facts &amp; Timeline:
              </label>
              <textarea
                id="scenario-textarea"
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="Describe what occurred, dates, dollar amounts, communication history, and any contract terms..."
                rows={3}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-y leading-relaxed"
              />
            </div>

            <div>
              <label htmlFor="jurisdiction-input" className="text-xs font-semibold text-slate-700 block mb-1">
                State / Country Jurisdiction:
              </label>
              <input
                id="jurisdiction-input"
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. California, Texas, UK, NY"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <p className="text-[11px] text-slate-700 mt-1">
                Applies statutory deadlines (e.g. 21-day deposit laws).
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="analyze-scenario-btn"
              onClick={handleRunScenario}
              disabled={isLoadingScenario || !customScenario.trim()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                isLoadingScenario || !customScenario.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-950 hover:bg-slate-900 text-amber-300 cursor-pointer active:scale-98'
              }`}
            >
              {isLoadingScenario ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Cross-Referencing Statutory Rights &amp; Remedies...</span>
                </>
              ) : (
                <>
                  <span>Analyze Rights &amp; Draft Demand Notice</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Scenario Results */}
        {scenarioResult && (
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Statutory Assessment Summary:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                {scenarioResult.scenarioSummary}
              </p>
            </div>

            {/* Principles and Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-slate-700" />
                  Governing Legal Principles:
                </h4>
                <ul className="space-y-1.5">
                  {scenarioResult.legalPrinciples.map((lp, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                      <span>{lp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Viable Legal Remedies &amp; Levers:
                </h4>
                <ul className="space-y-1.5">
                  {scenarioResult.optionsAndRemedies.map((opt, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step by Step Action Plan */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recommended Sequential Action Plan:
              </h4>
              <div className="space-y-2">
                {scenarioResult.stepByStepPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Letter Template */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Custom Formal Legal Notice &amp; Demand Letter
                  </h4>
                </div>

                <button
                  id="copy-custom-letter-btn"
                  onClick={() => handleCopy(scenarioResult.customizableLetterTemplate)}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied Letter to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Letter
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
                {scenarioResult.customizableLetterTemplate}
              </pre>
            </div>

            {/* When to hire a lawyer */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                When You Should Escalate to Licensed Counsel:
              </h5>
              <ul className="space-y-1.5">
                {scenarioResult.whenToHireLawyer.map((crit, idx) => (
                  <li key={idx} className="text-xs text-amber-950 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Curated Topic Guides & Common Dilemmas */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-700" />
          Pre-Engineered Legal Playbooks &amp; Dispute Letters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LEGAL_TOPIC_GUIDES.map((guide) => {
            const isSelected = selectedGuide.id === guide.id;
            return (
              <button
                key={guide.id}
                id={`guide-card-${guide.id}`}
                onClick={() => setSelectedGuide(guide)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-slate-950 bg-slate-950 text-white shadow-sm ring-1 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {getCategoryIcon(guide.category)}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {guide.category} Law
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mb-1 line-clamp-1">{guide.title}</h4>
                  <p
                    className={`text-xs line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {guide.summary}
                  </p>
                </div>

                <div
                  className={`mt-3 text-[11px] font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-amber-300' : 'text-slate-700'
                  }`}
                >
                  <span>View Playbook &amp; Letter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Guide Details */}
        {selectedGuide && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  {selectedGuide.category} Rights Guide
                </span>
                <h4 className="text-base font-bold text-slate-900 font-serif">{selectedGuide.title}</h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {selectedGuide.summary}
            </p>

            {/* Traps vs Action steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/60 space-y-2">
                <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Common Traps to Avoid:
                </h5>
                <ul className="space-y-1.5">
                  {selectedGuide.commonTraps.map((trap, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 space-y-2">
                <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Actionable Steps:
                </h5>
                <ul className="space-y-1.5">
                  {selectedGuide.actionSteps.map((step, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Letter Template */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                    {selectedGuide.letterTemplateTitle}
                  </h5>
                </div>

                <button
                  id="copy-guide-letter-btn"
                  onClick={() => handleCopy(selectedGuide.letterTemplate)}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied Letter
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Template
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
                {selectedGuide.letterTemplate}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
