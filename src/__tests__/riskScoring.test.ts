import { describe, it, expect } from 'vitest';
import { calculateRiskGrade } from '../utils/legalMath';

describe('Legal Risk Grading Engine', () => {
  it('should assign Grade D- for extreme risk scores (>= 80)', () => {
    const res85 = calculateRiskGrade(85);
    expect(res85.grade).toBe('D-');
    expect(res85.text).toContain('Severe Liability');

    const res100 = calculateRiskGrade(100);
    expect(res100.grade).toBe('D-');
  });

  it('should assign Grade C for high risk scores (60 - 79)', () => {
    const res65 = calculateRiskGrade(65);
    expect(res65.grade).toBe('C');
    expect(res65.text).toContain('Significant Unfavorable Clauses');

    const res79 = calculateRiskGrade(79);
    expect(res79.grade).toBe('C');
  });

  it('should assign Grade B for moderate risk scores (35 - 59)', () => {
    const res45 = calculateRiskGrade(45);
    expect(res45.grade).toBe('B');
    expect(res45.text).toContain('Moderate Commercial Disproportion');

    const res35 = calculateRiskGrade(35);
    expect(res35.grade).toBe('B');
  });

  it('should assign Grade A for balanced standard scores (< 35)', () => {
    const res20 = calculateRiskGrade(20);
    expect(res20.grade).toBe('A');
    expect(res20.text).toContain('Balanced Agreement');

    const res0 = calculateRiskGrade(0);
    expect(res0.grade).toBe('A');
  });

  it('should clamp out-of-bound scores gracefully', () => {
    const negative = calculateRiskGrade(-15);
    expect(negative.grade).toBe('A');

    const overMax = calculateRiskGrade(150);
    expect(overMax.grade).toBe('D-');
  });
});
