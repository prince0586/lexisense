import { describe, it, expect } from 'vitest';
import { filterClauses } from '../utils/legalMath';
import { AnalyzedClause } from '../types';

const mockClauses: AnalyzedClause[] = [
  {
    id: 'c1',
    title: 'Unilateral Rent Increase',
    category: 'Financial',
    riskLevel: 'High Risk',
    originalExcerpt: 'Landlord may increase monthly rent by any amount upon 7 days written notice.',
    simplifiedExplanation: 'The landlord can raise your rent with almost no warning.',
    recommendationOrRedline: 'Rent shall remain fixed for the initial 12-month term.',
    counterLanguageRationale: 'Protects tenant budget from arbitrary spikes.',
  },
  {
    id: 'c2',
    title: 'Automatic 24-Month Renewal',
    category: 'Termination',
    riskLevel: 'High Risk',
    originalExcerpt: 'This lease renews automatically for 24 months unless cancelled 90 days prior.',
    simplifiedExplanation: 'If you miss the 90-day window you are locked in for 2 more years.',
    recommendationOrRedline: 'Convert to month-to-month after 12 months with 30 days notice.',
  },
  {
    id: 'c3',
    title: 'Notice for Routine Maintenance',
    category: 'Termination',
    riskLevel: 'Caution',
    originalExcerpt: 'Landlord may enter with 12 hours advance text notice.',
    simplifiedExplanation: 'Requires short 12-hour notice before entering.',
  },
  {
    id: 'c4',
    title: 'Quiet Enjoyment',
    category: 'Other',
    riskLevel: 'Safe',
    originalExcerpt: 'Tenant shall have peaceful and quiet enjoyment of premises.',
    simplifiedExplanation: 'Standard protection ensuring peaceful residency.',
  },
];

describe('Clause Filtering & Redline Isolation Engine', () => {
  it('should return all clauses when default filters are applied', () => {
    const result = filterClauses(mockClauses, {});
    expect(result.length).toBe(4);
  });

  it('should filter strictly by risk level', () => {
    const highRisk = filterClauses(mockClauses, { riskFilter: 'high' });
    expect(highRisk.length).toBe(2);
    expect(highRisk.every((c) => c.riskLevel === 'High Risk')).toBe(true);

    const safeOnly = filterClauses(mockClauses, { riskFilter: 'safe' });
    expect(safeOnly.length).toBe(1);
    expect(safeOnly[0].id).toBe('c4');
  });

  it('should filter clauses that contain actionable redline recommendations only', () => {
    const withRedline = filterClauses(mockClauses, { onlyWithRedline: true });
    expect(withRedline.length).toBe(2);
    expect(withRedline.every((c) => Boolean(c.recommendationOrRedline))).toBe(true);
  });

  it('should filter by specific legal category', () => {
    const financial = filterClauses(mockClauses, { categoryFilter: 'Financial' });
    expect(financial.length).toBe(1);
    expect(financial[0].id).toBe('c1');
  });

  it('should match search query across title, excerpt, and simplified text', () => {
    const searchRent = filterClauses(mockClauses, { searchQuery: 'rent' });
    expect(searchRent.length).toBe(1);
    expect(searchRent[0].id).toBe('c1');

    const searchNotice = filterClauses(mockClauses, { searchQuery: 'notice' });
    expect(searchNotice.length).toBe(3); // c1 (7 days notice), c2 (90 days prior), c3 (12 hours)
  });
});
