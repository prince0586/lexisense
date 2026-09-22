import React from 'react';
import {
  Scale,
  FileText,
  GitCompare,
  MessageSquareText,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';

export type AppMode = 'analyzer' | 'compare' | 'qa' | 'navigator';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  hasDocumentLoaded: boolean;
  documentTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  hasDocumentLoaded,
  documentTitle,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-30 shadow-md">
      {/* Top Professional Disclaimer Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 text-[11px] px-4 py-1.5 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400 uppercase tracking-wider text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              Educational Notice
            </span>
            <span className="truncate">
              Informational legal intelligence aid &amp; analysis. Not an attorney client relationship or substitute for licensed counsel.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              Confidential Client-Side Sandbox
            </span>
            <span>&bull;</span>
            <span className="text-amber-300 font-medium">Gemini 3.8 Intelligence</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-slate-900 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-serif">
                  LEXISENSE
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Legal Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Understand clauses &bull; Redline traps &bull; Compare contracts &bull; Prepare attorney kits
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0" aria-label="Main Navigation">
            <button
              id="nav-tab-analyzer"
              onClick={() => onSelectMode('analyzer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentMode === 'analyzer'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Document Analyzer
            </button>

            <button
              id="nav-tab-compare"
              onClick={() => onSelectMode('compare')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentMode === 'compare'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare Agreements
            </button>

            <button
              id="nav-tab-qa"
              onClick={() => onSelectMode('qa')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                currentMode === 'qa'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              Interactive Q&amp;A
              {hasDocumentLoaded && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"
                  title="Document active in memory"
                />
              )}
            </button>

            <button
              id="nav-tab-navigator"
              onClick={() => onSelectMode('navigator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentMode === 'navigator'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Rights &amp; Remedies
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
