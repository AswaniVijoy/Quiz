export interface Option {
  label: string;
  text: string;
}

export interface Question {
  _id: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  category: string;
}

export interface QuizSet {
  _id: string;
  title: string;
  description: string;
  category: string;
  questionIds: string[];
}

export interface QuizAttempt {
  quizSetId: string;
  quizSetTitle: string;
  answers: { questionId: string; selected: string }[];
  score: number;
  total: number;
  completedAt: string;
  synced: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}