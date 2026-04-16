import {
  cacheQuizSets,
  getCachedQuizSets,
  cacheQuestions,
  getCachedQuestions
} from '../utils/storage';

// ✅ ONLY use ngrok URL (NO localhost anywhere)
const BASE_URL = 'https://ignore-uncover-reliant.ngrok-free.dev';

// 🔥 COMMON HEADERS
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
});

// 🚀 FETCH QUIZ SETS
export const fetchQuizSets = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${BASE_URL}/quiz-sets`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Bad response');

    const data = await res.json();

    console.log('✅ QUIZ SETS:', data);

    await cacheQuizSets(data);
    return data;

  } catch (e) {
    console.log('❌ QuizSets Error → loading from cache', e);
    return getCachedQuizSets();
  }
};


// 🚀 FETCH QUESTIONS
export const fetchQuestions = async (ids: string[]): Promise<any[]> => {
  try {
    const res = await fetch(`${BASE_URL}/quiz`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Bad response');

    const all = await res.json();

    console.log('✅ ALL QUESTIONS:', all);
    console.log('✅ EXPECTED IDS:', ids);

    const idSet = new Set(ids.map(id => String(id)));

    const filtered = all.filter((q: any) =>
      idSet.has(String(q._id))
    );

    console.log('✅ MATCHED QUESTIONS:', filtered);

    await cacheQuestions(all);

    return filtered;

  } catch (e) {
    console.log('❌ Questions Error → loading from cache', e);

    const cached = await getCachedQuestions();

    const idSet = new Set(ids.map(id => String(id)));

    return cached.filter((q: any) =>
      idSet.has(String(q._id))
    );
  }
};