import { MBTIResult } from '../types/mbti';

const MBTI_STORAGE_KEY = 'mbti_results';

export function saveMBTIResult(result: MBTIResult): void {
  try {
    const existingResults = getMBTIResults();
    localStorage.setItem(
      MBTI_STORAGE_KEY,
      JSON.stringify([...existingResults, result])
    );
  } catch (error) {
    console.error('Failed to save MBTI result:', error);
  }
}

export function getMBTIResults(): MBTIResult[] {
  try {
    const results = localStorage.getItem(MBTI_STORAGE_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Failed to get MBTI results:', error);
    return [];
  }
}

export function getMBTIResult(): MBTIResult | null {
  try {
    const results = getMBTIResults();
    return results.length > 0 ? results[results.length - 1] : null;
  } catch (error) {
    console.error('Failed to get latest MBTI result:', error);
    return null;
  }
}

export function clearMBTIResults(): void {
  try {
    localStorage.removeItem(MBTI_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear MBTI results:', error);
  }
}

export function loadMBTIHistory(): MBTIResult[] {
  try {
    return JSON.parse(localStorage.getItem('mbtiHistory') || '[]');
  } catch (error) {
    console.error('MBTI履歴の読み込みに失敗しました:', error);
    return [];
  }
} 