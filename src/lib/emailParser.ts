import { ParsedEmailItem } from '../types';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface ParseResult {
  items: ParsedEmailItem[];
  stats: {
    totalExtracted: number;
    validCount: number;
    invalidCount: number;
    duplicatesRemovedCount: number;
    alreadyContactedCount: number;
  };
}

export function parseHrEmails(rawInput: string, contactedSet: Set<string>): ParseResult {
  if (!rawInput || !rawInput.trim()) {
    return {
      items: [],
      stats: {
        totalExtracted: 0,
        validCount: 0,
        invalidCount: 0,
        duplicatesRemovedCount: 0,
        alreadyContactedCount: 0,
      },
    };
  }

  // Split by newlines, commas, semicolons, spaces, and tabs
  const tokens = rawInput
    .split(/[\n\r,;\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const seenInBatch = new Set<string>();
  const items: ParsedEmailItem[] = [];

  let totalExtracted = 0;
  let duplicatesRemovedCount = 0;
  let invalidCount = 0;
  let validCount = 0;
  let alreadyContactedCount = 0;

  for (const token of tokens) {
    // Clean markdown mailto links e.g. [hr@co.com](mailto:hr@co.com) or mailto:hr@co.com
    let cleaned = token
      .replace(/\[.*?\]\((mailto:)?/gi, '')
      .replace(/^mailto:/gi, '')
      .replace(/[()<>[\]"']/g, '')
      .trim();

    // Sometimes markdown links end with closing parenthesis
    if (cleaned.endsWith(')')) {
      cleaned = cleaned.slice(0, -1).trim();
    }

    if (!cleaned) continue;

    totalExtracted++;
    const lower = cleaned.toLowerCase();

    // Check duplicate in current batch input
    if (seenInBatch.has(lower)) {
      duplicatesRemovedCount++;
      continue;
    }
    seenInBatch.add(lower);

    const isValid = EMAIL_REGEX.test(cleaned);
    const isAlreadyContacted = contactedSet.has(lower);

    if (!isValid) {
      invalidCount++;
      items.push({
        id: `email-${Math.random().toString(36).substring(2, 9)}`,
        email: cleaned,
        isValid: false,
        isAlreadyContacted: false,
        selected: false,
        reason: 'Invalid email format',
      });
    } else {
      validCount++;
      if (isAlreadyContacted) {
        alreadyContactedCount++;
      }

      items.push({
        id: `email-${Math.random().toString(36).substring(2, 9)}`,
        email: cleaned,
        isValid: true,
        isAlreadyContacted,
        selected: true, // Selected by default
      });
    }
  }

  return {
    items,
    stats: {
      totalExtracted,
      validCount,
      invalidCount,
      duplicatesRemovedCount,
      alreadyContactedCount,
    },
  };
}
