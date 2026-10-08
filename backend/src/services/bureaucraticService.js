/**
 * Telmy Backend — Bureaucratic & Scholarship Term Dictionary Service (Priority 4.3)
 * Manages official preservation rules (DO_NOT_TRANSLATE, FORCE_TRANSLATE, EXPLAIN_IN_PARENTHESES)
 * and dynamically injects only the top relevant terms into Gemini translation prompts (RAG).
 */

import { getFirestore } from '../config/firebase.js';

// Pre-seeded official bureaucratic & scholarship dictionary
export const SEED_BUREAUCRATIC_TERMS = [
  {
    term: 'NIK',
    category: 'Civil Registry',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep "NIK" or translate to "NIK (National Identification Number)"'
  },
  {
    term: 'KTP',
    category: 'Civil Registry',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep "KTP" or translate to "KTP (Indonesian National Identity Card)"'
  },
  {
    term: 'NPWP',
    category: 'Taxation',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep "NPWP" or translate to "NPWP (Taxpayer Identification Number)"'
  },
  {
    term: 'SKCK',
    category: 'Law Enforcement',
    rule: 'FORCE_TRANSLATE',
    instruction: 'Translate to "Police Clearance Certificate (SKCK)"'
  },
  {
    term: 'Apostille',
    category: 'Legalization',
    rule: 'DO_NOT_TRANSLATE',
    instruction: 'Keep as "Apostille" or "Apostille Certificate" (Hague Convention)'
  },
  {
    term: 'KITAS',
    category: 'Immigration',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep as "KITAS (Limited Stay Permit Card)"'
  },
  {
    term: 'KITAP',
    category: 'Immigration',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep as "KITAP (Permanent Stay Permit Card)"'
  },
  {
    term: 'ToR',
    category: 'Scholarship',
    rule: 'FORCE_TRANSLATE',
    instruction: 'Translate "ToR" or "Transkrip Nilai" to "Official Transcript of Records (ToR)"'
  },
  {
    term: 'Affidavit of Support',
    category: 'Visa & Scholarship',
    rule: 'DO_NOT_TRANSLATE',
    instruction: 'Keep "Affidavit of Support" (Surat Pernyataan Jaminan Finansial Resmi)'
  },
  {
    term: 'Schengen Visa',
    category: 'Visa',
    rule: 'DO_NOT_TRANSLATE',
    instruction: 'Keep "Schengen Visa" as official diplomatic category'
  },
  {
    term: 'MEXT',
    category: 'Scholarship',
    rule: 'DO_NOT_TRANSLATE',
    instruction: 'Keep "MEXT (Monbukagakusho Japanese Government Scholarship)"'
  },
  {
    term: 'LPDP',
    category: 'Scholarship',
    rule: 'EXPLAIN_IN_PARENTHESES',
    instruction: 'Keep "LPDP (Indonesia Endowment Fund for Education)"'
  },
  {
    term: 'Alien Registration',
    category: 'Immigration',
    rule: 'FORCE_TRANSLATE',
    instruction: 'Translate to "Alien Registration / Resident Registration Card"'
  }
];

/**
 * Scan tokens and find Top-N relevant bureaucratic terms for prompt injection
 * @param {object|string} texts - Extracted DOM text tokens or page title
 * @param {number} limit - Maximum rules to inject (keeps prompt compact & token-efficient)
 * @returns {string} Formatted glossary prompt rules
 */
export function getRelevantGlossaryRules(texts, limit = 5) {
  const combined = typeof texts === 'string'
    ? texts.toLowerCase()
    : JSON.stringify(texts).toLowerCase();

  const matched = [];

  for (const item of SEED_BUREAUCRATIC_TERMS) {
    const termLower = item.term.toLowerCase();
    if (combined.includes(termLower)) {
      matched.push(item);
    }
  }

  // If few or no direct matches found, include standard civil essentials
  if (matched.length < limit) {
    for (const item of SEED_BUREAUCRATIC_TERMS) {
      if (!matched.includes(item)) {
        matched.push(item);
        if (matched.length >= limit) break;
      }
    }
  }

  const selected = matched.slice(0, limit);

  return `OFFICIAL BUREAUCRATIC & SCHOLARSHIP PRESERVATION RULES (In-Context RAG Injection):
${selected.map((s, idx) => `${idx + 1}. [${s.category}] "${s.term}" -> ${s.instruction}`).join('\n')}`;
}
