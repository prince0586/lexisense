import { AnalyzedClause } from '../types';

export interface RiskGradeResult {
  grade: 'A' | 'B' | 'C' | 'D-';
  text: string;
  badgeBg: string;
  dotColor: string;
}

/**
 * Calculates standardized institutional legal risk grade based on score (0-100)
 */
export function calculateRiskGrade(score: number): RiskGradeResult {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  if (boundedScore >= 80) {
    return {
      grade: 'D-',
      text: 'Severe Liability Exposure & High-Risk Asymmetry',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      dotColor: 'bg-rose-600',
    };
  }

  if (boundedScore >= 60) {
    return {
      grade: 'C',
      text: 'Significant Unfavorable Clauses & Hidden Traps',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
      dotColor: 'bg-rose-500',
    };
  }

  if (boundedScore >= 35) {
    return {
      grade: 'B',
      text: 'Moderate Commercial Disproportion',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      dotColor: 'bg-amber-500',
    };
  }

  return {
    grade: 'A',
    text: 'Balanced Agreement with Standard Market Conventions',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    dotColor: 'bg-emerald-500',
  };
}

export interface ClauseFilterOptions {
  riskFilter?: string; // 'all' | 'high' | 'caution' | 'safe'
  categoryFilter?: string; // 'all' | specific category
  onlyWithRedline?: boolean;
  searchQuery?: string;
}

/**
 * Pure function to filter analyzed clauses deterministically
 */
export function filterClauses(
  clauses: AnalyzedClause[],
  options: ClauseFilterOptions
): AnalyzedClause[] {
  const {
    riskFilter = 'all',
    categoryFilter = 'all',
    onlyWithRedline = false,
    searchQuery = '',
  } = options;

  const query = searchQuery.trim().toLowerCase();

  return clauses.filter((clause) => {
    // Risk filter match
    if (riskFilter !== 'all') {
      const clauseRisk = clause.riskLevel.toLowerCase();
      if (riskFilter === 'high' && !clauseRisk.includes('high')) return false;
      if (riskFilter === 'caution' && !clauseRisk.includes('caution')) return false;
      if (riskFilter === 'safe' && !clauseRisk.includes('safe') && !clauseRisk.includes('standard'))
        return false;
    }

    // Category filter match
    if (categoryFilter !== 'all' && clause.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    // Only with redline
    if (onlyWithRedline && !clause.recommendationOrRedline) {
      return false;
    }

    // Search query match
    if (query) {
      const matchTitle = clause.title.toLowerCase().includes(query);
      const matchExcerpt = clause.originalExcerpt.toLowerCase().includes(query);
      const matchExplanation = clause.simplifiedExplanation.toLowerCase().includes(query);
      const matchRedline = clause.recommendationOrRedline?.toLowerCase().includes(query);

      if (!matchTitle && !matchExcerpt && !matchExplanation && !matchRedline) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Fast deterministic non-cryptographic hash for client-side memoization
 */
export function generateDocumentHash(text: string): string {
  let hash = 5381;
  const clean = text.trim();
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 33) ^ clean.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Sanitizes and caps raw document input to prevent buffer overruns
 */
export function sanitizeDocumentInput(rawText: string, maxChars = 50000): string {
  if (!rawText) return '';
  // Strip dangerous control chars while preserving newlines and legal punctuation
  const cleaned = rawText
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
}
