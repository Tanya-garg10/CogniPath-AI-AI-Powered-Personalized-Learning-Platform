export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  grade?: string;
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlockedAt?: string;
  category: 'algebra' | 'streak' | 'accuracy' | 'mastery' | 'community';
}

export interface MathProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  equation: string;
  description: string;
  expectedSteps: string[];
  commonMisconceptions?: string[];
}

export interface SolvingStep {
  stepIndex: number;
  expression: string;
  explanation?: string;
  timeTakenMs: number;
  correctionsCount: number;
  hasError?: boolean;
}

export type MisconceptionType = 
  | 'Sign Error'
  | 'Formula Misuse'
  | 'Variable Confusion'
  | 'Arithmetic Error'
  | 'Distribution Error'
  | 'Conceptual Misunderstanding'
  | 'None';

export interface MisconceptionResult {
  hasMisconception: boolean;
  misconceptionType: MisconceptionType;
  confidenceScore: number; // 0 to 100
  failedStepIndex: number;
  failedStepContent: string;
  explanationText: string;
  rootCause: string;
  difficultyRating: string;
}

export interface AITutorExplanation {
  simpleExplanation: string;
  visualExplanation: {
    title: string;
    stepsDiagram: Array<{ step: string; note: string; highlight?: boolean }>;
  };
  realLifeAnalogy: string;
  solvedExample: {
    problem: string;
    steps: string[];
  };
  practiceQuestions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  microLesson: {
    title: string;
    content: string;
    keyTakeaway: string;
  };
  nextRecommendation: {
    topic: string;
    reason: string;
  };
  motivationalFeedback: string;
}

export interface StudentMistakeLog {
  id: string;
  studentId: string;
  studentName: string;
  problemId: string;
  problemTitle: string;
  timestamp: string;
  misconceptionType: MisconceptionType;
  stepDetails: string;
  status: 'Unresolved' | 'Reviewing' | 'Mastered';
  timeSpentSec: number;
}

export interface ClassPerformanceStats {
  totalStudents: number;
  averageAccuracy: number;
  activeStreakAvg: number;
  topMisconceptions: Array<{ type: MisconceptionType; count: number; percentage: number }>;
  weeklyProgress: Array<{ day: string; solved: number; errorsDetected: number; accuracy: number }>;
  topicMastery: Array<{ topic: string; masteryPercent: number }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'achievement' | 'improvement' | 'assignment' | 'system';
  read: boolean;
}

export interface AIModelConfig {
  activeModel: string;
  temperature: number;
  topP: number;
  systemPromptOverride?: string;
  enableThinking: boolean;
}
