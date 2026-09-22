export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';
export type ClauseRisk = 'Safe' | 'Caution' | 'High Risk';

export interface AnalyzedClause {
  id: string;
  title: string;
  originalExcerpt: string;
  simplifiedExplanation: string;
  riskLevel: ClauseRisk;
  category:
    | 'Financial'
    | 'Termination'
    | 'Liability & Indemnity'
    | 'Intellectual Property'
    | 'Dispute & Jurisdiction'
    | 'Privacy & Data'
    | 'Restrictive Covenants'
    | 'Other';
  recommendationOrRedline?: string;
  urgency?: 'Immediate Action' | 'Review Prior to Signing' | 'Standard Term';
  counterLanguageRationale?: string;
}

export interface ObligationItem {
  title: string;
  type: 'Deadline' | 'Payment' | 'Notice' | 'Restriction' | 'Deliverable';
  description: string;
  timingOrAmount?: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface AttorneyConsultationKit {
  briefSituation: string;
  topQuestionsForAttorney: string[];
  potentialRedFlagsToReview: string[];
  recommendedNegotiationPoints: string[];
}

export interface LegalAnalysis {
  title: string;
  documentType: string;
  overallRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  oneSentenceSummary: string;
  executiveSummary: string;
  eli5Summary: string;
  governingLawDetected?: string;
  partiesDetected?: string[];
  topActionableRecommendations?: string[];
  keyPros: string[];
  keyCons: string[];
  clauses: AnalyzedClause[];
  obligationsAndDeadlines: ObligationItem[];
  attorneyConsultationKit: AttorneyConsultationKit;
}

export interface ComparisonDifference {
  category: string;
  docASummary: string;
  docBSummary: string;
  whichIsMoreFavorable: 'Document A' | 'Document B' | 'Similar / Equivalent';
  explanation: string;
}

export interface ComparisonAnalysis {
  docATitle: string;
  docBTitle: string;
  comparisonVerdict: string;
  favors: 'Document A' | 'Document B' | 'Balanced / Neutral';
  overallAssessment: string;
  keyDifferences: ComparisonDifference[];
  riskDelta: string;
  recommendations: string[];
}

export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relevantClauses?: Array<{ title: string; excerpt: string }>;
  suggestedFollowUps?: string[];
}

export interface LegalTopicGuide {
  id: string;
  title: string;
  category: 'Housing' | 'Workplace' | 'Freelance' | 'Consumer';
  summary: string;
  commonTraps: string[];
  actionSteps: string[];
  sampleDocumentSnippet: string;
  letterTemplateTitle: string;
  letterTemplate: string;
  whenToConsultLawyer: string[];
}
