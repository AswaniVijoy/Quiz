import { Platform } from 'react-native';
import { QuizAttempt, QuizSet, Question } from '../types';

const KEYS = {
  ATTEMPTS: (userId: string) => `quiz_attempts_${userId}`,
  CACHED_SETS: 'cached_quiz_sets',
  CACHED_QUESTIONS: 'cached_questions',
};

const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') return localStorage.getItem(key);
  const A = (await import('@react-native-async-storage/async-storage')).default;
  return A.getItem(key);
};

const setItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
  const A = (await import('@react-native-async-storage/async-storage')).default;
  await A.setItem(key, value);
};

// ─── Attempts (per user) ──────────────────────────────────

// Pass userId so each user has their own attempts
export const saveAttempt = async (
  attempt: QuizAttempt,
  userId: string,
): Promise<void> => {
  try {
    const existing = await getAttempts(userId);
    const updated = [attempt, ...existing];
    await setItem(KEYS.ATTEMPTS(userId), JSON.stringify(updated));
  } catch (e) {
    console.log('saveAttempt error:', e);
  }
};

export const getAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const data = await getItem(KEYS.ATTEMPTS(userId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ─── Cache (shared — not per user) ───────────────────────

export const cacheQuizSets = async (sets: QuizSet[]): Promise<void> => {
  try {
    await setItem(KEYS.CACHED_SETS, JSON.stringify(sets));
  } catch (e) { console.log('cacheQuizSets error:', e); }
};

export const getCachedQuizSets = async (): Promise<QuizSet[]> => {
  try {
    const data = await getItem(KEYS.CACHED_SETS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

export const cacheQuestions = async (questions: Question[]): Promise<void> => {
  try {
    await setItem(KEYS.CACHED_QUESTIONS, JSON.stringify(questions));
  } catch (e) { console.log('cacheQuestions error:', e); }
};

export const getCachedQuestions = async (): Promise<Question[]> => {
  try {
    const data = await getItem(KEYS.CACHED_QUESTIONS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};