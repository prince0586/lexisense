import { describe, it, expect } from 'vitest';
import { sanitizeDocumentInput, generateDocumentHash } from '../utils/legalMath';

describe('Document Sanitization & Caching Utilities', () => {
  it('should trim and strip control characters', () => {
    const dirty = '  Lease Agreement \u0000 with hidden null byte and \u0008 backspace. ';
    const cleaned = sanitizeDocumentInput(dirty);
    expect(cleaned).toBe('Lease Agreement  with hidden null byte and  backspace.');
  });

  it('should enforce maximum length bounds', () => {
    const longText = 'A'.repeat(60000);
    const bounded = sanitizeDocumentInput(longText, 50000);
    expect(bounded.length).toBe(50000);
  });

  it('should generate consistent hashes for identical text', () => {
    const doc = 'Standard Non-Disclosure Agreement between Party A and Party B.';
    const hash1 = generateDocumentHash(doc);
    const hash2 = generateDocumentHash(doc);
    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
  });

  it('should produce distinct hashes for different texts', () => {
    const docA = 'Employment Contract v1.0';
    const docB = 'Employment Contract v2.0';
    expect(generateDocumentHash(docA)).not.toBe(generateDocumentHash(docB));
  });
});
