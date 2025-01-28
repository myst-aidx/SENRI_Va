import { z } from 'zod';

export const NumerologyResultSchema = z.object({
  type: z.literal('numerology'),
  reading: z.string(),
  timestamp: z.string(),
  birthDate: z.string(),
  name: z.string().optional(),
  destinyNumber: z.number(),
  nameNumber: z.number().optional(),
  description: z.string(),
  detailedDescription: z.string(),
  positiveTraits: z.array(z.string()),
  challenges: z.array(z.string()),
  compatibleNumbers: z.array(z.number()),
  luckyItems: z.array(z.string())
});

export type NumerologyResult = z.infer<typeof NumerologyResultSchema>;

const NUMEROLOGY_STORAGE_KEY = 'numerology_result';

export function saveNumerologyResult(result: NumerologyResult): void {
  try {
    localStorage.setItem(NUMEROLOGY_STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.error('Failed to save numerology result:', error);
  }
}

export function getNumerologyResult(): NumerologyResult | null {
  try {
    const stored = localStorage.getItem(NUMEROLOGY_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as NumerologyResult;
  } catch (error) {
    console.error('Failed to get numerology result:', error);
    return null;
  }
}

export function clearNumerologyResult(): void {
  try {
    localStorage.removeItem(NUMEROLOGY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear numerology result:', error);
  }
} 