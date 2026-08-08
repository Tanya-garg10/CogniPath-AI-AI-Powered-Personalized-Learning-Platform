import { User, MathProblem, StudentMistakeLog, ClassPerformanceStats, Badge, NotificationItem, AIModelConfig } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Alex Rivera',
  email: 'alex.rivera@cognipath.edu',
  role: 'student',
  grade: 'Grade 9 - Algebra I',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  streak: 7,
  xp: 1420,
  level: 4,
  badges: [
    {
      id: 'bdg_01',
      title: 'Sign Ninja',
      description: 'Eliminated 5 Sign Errors in Linear Equations',
      icon: '✨',
      unlockedAt: '2026-07-20',
      category: 'algebra',
    },
    {
      id: 'bdg_02',
      title: '7-Day Spark',
      description: 'Maintained a 7-day daily math learning streak',
      icon: '🔥',
      unlockedAt: '2026-07-24',
      category: 'streak',
    },
    {
      id: 'bdg_03',
      title: 'Distributor Master',
      description: 'Mastered the Distributive Property in algebraic expressions',
      icon: '🎯',
      unlockedAt: '2026-07-22',
      category: 'mastery',
    },
  ],
};

export const SAMPLE_PROBLEMS: MathProblem[] = [
  {
    id: 'prob_01',
    title: 'Solving Distributive Equations',
    topic: 'Linear Equations',
    difficulty: 'Medium',
    equation: '2(x + 3) = 10',
    description: 'Solve for x by first expanding the left side using the distributive property.',
    expectedSteps: [
      '2(x + 3) = 10',
      '2x + 6 = 10',
      '2x = 4',
      'x = 2'
    ],
    commonMisconceptions: ['Distribution Error: Forgetting to multiply 2 by 3', 'Sign Error: Subtracting incorrectly']
  },
  {
    id: 'prob_02',
    title: 'Negative Coefficients Expansion',
    topic: 'Algebra Basics',
    difficulty: 'Medium',
    equation: '-3(2x - 4) = 18',
    description: 'Distribute the negative coefficient carefully across subtraction.',
    expectedSteps: [
      '-3(2x - 4) = 18',
      '-6x + 12 = 18',
      '-6x = 6',
      'x = -1'
    ],
    commonMisconceptions: ['Sign Error: -3 * -4 resulting in -12 instead of +12', 'Distribution Error']
  },
  {
    id: 'prob_03',
    title: 'Two-Step Equation with Fractions',
    topic: 'Algebra I',
    difficulty: 'Easy',
    equation: '(x / 4) + 5 = 11',
    description: 'Isolate the variable term first before clearing the fraction.',
    expectedSteps: [
      '(x / 4) + 5 = 11',
      'x / 4 = 6',
      'x = 24'
    ],
    commonMisconceptions: ['Arithmetic Error', 'Formula Misuse: Multiplying before subtracting']
  },
  {
    id: 'prob_04',
    title: 'Combining Like Terms',
    topic: 'Polynomials',
    difficulty: 'Hard',
    equation: '3x + 4 - 2(x - 5) = 15',
    description: 'Simplify terms with variables before solving for x.',
    expectedSteps: [
      '3x + 4 - 2(x - 5) = 15',
      '3x + 4 - 2x + 10 = 15',
      'x + 14 = 15',
      'x = 1'
    ],
    commonMisconceptions: ['Variable Confusion: Adding x terms to constants', 'Sign Error']
  }
];

export const MOCK_MISTAKE_LOGS: StudentMistakeLog[] = [
  {
    id: 'mst_01',
    studentId: 'usr_001',
    studentName: 'Alex Rivera',
    problemId: 'prob_01',
    problemTitle: '2(x + 3) = 10',
    timestamp: '2026-07-25 08:30 AM',
    misconceptionType: 'Distribution Error',
    stepDetails: 'Wrote 2x + 3 = 10 instead of 2x + 6 = 10',
    status: 'Reviewing',
    timeSpentSec: 145,
  },
  {
    id: 'mst_02',
    studentId: 'usr_001',
    studentName: 'Alex Rivera',
    problemId: 'prob_02',
    problemTitle: '-3(2x - 4) = 18',
    timestamp: '2026-07-24 04:15 PM',
    misconceptionType: 'Sign Error',
    stepDetails: 'Wrote -6x - 12 = 18 (missed negative times negative)',
    status: 'Mastered',
    timeSpentSec: 210,
  },
  {
    id: 'mst_03',
    studentId: 'usr_002',
    studentName: 'Maya Lin',
    problemId: 'prob_04',
    problemTitle: '3x + 4 - 2(x - 5) = 15',
    timestamp: '2026-07-24 02:00 PM',
    misconceptionType: 'Variable Confusion',
    stepDetails: 'Combined 3x + 4 into 7x',
    status: 'Unresolved',
    timeSpentSec: 180,
  },
  {
    id: 'mst_04',
    studentId: 'usr_003',
    studentName: 'Jordan Vance',
    problemId: 'prob_01',
    problemTitle: '2(x + 3) = 10',
    timestamp: '2026-07-23 11:20 AM',
    misconceptionType: 'Distribution Error',
    stepDetails: 'Forgot to multiply constant term inside parentheses',
    status: 'Reviewing',
    timeSpentSec: 130,
  }
];

export const MOCK_CLASS_STATS: ClassPerformanceStats = {
  totalStudents: 28,
  averageAccuracy: 78.4,
  activeStreakAvg: 5.2,
  topMisconceptions: [
    { type: 'Distribution Error', count: 42, percentage: 38 },
    { type: 'Sign Error', count: 31, percentage: 28 },
    { type: 'Variable Confusion', count: 20, percentage: 18 },
    { type: 'Formula Misuse', count: 11, percentage: 10 },
    { type: 'Arithmetic Error', count: 6, percentage: 6 },
  ],
  weeklyProgress: [
    { day: 'Mon', solved: 140, errorsDetected: 32, accuracy: 77 },
    { day: 'Tue', solved: 185, errorsDetected: 28, accuracy: 84 },
    { day: 'Wed', solved: 160, errorsDetected: 35, accuracy: 78 },
    { day: 'Thu', solved: 210, errorsDetected: 25, accuracy: 88 },
    { day: 'Fri', solved: 190, errorsDetected: 30, accuracy: 84 },
    { day: 'Sat', solved: 110, errorsDetected: 18, accuracy: 83 },
    { day: 'Sun', solved: 130, errorsDetected: 22, accuracy: 83 },
  ],
  topicMastery: [
    { topic: 'Linear Equations', masteryPercent: 82 },
    { topic: 'Distributive Property', masteryPercent: 64 },
    { topic: 'Fractions & Ratios', masteryPercent: 78 },
    { topic: 'Polynomial Expansion', masteryPercent: 58 },
    { topic: 'Quadratic Expressions', masteryPercent: 49 },
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Algebra Progress!',
    message: 'You improved in Algebra! Distribution Error reduced by 40%.',
    timestamp: '10 mins ago',
    type: 'improvement',
    read: false,
  },
  {
    id: 'notif_02',
    title: 'New Badge Unlocked',
    message: 'Congratulations! You unlocked "7-Day Spark" badge!',
    timestamp: '2 hours ago',
    type: 'achievement',
    read: false,
  },
  {
    id: 'notif_03',
    title: 'Assignment Updated',
    message: 'Dr. Sarah assigned 3 practice problems on Negative Coefficients.',
    timestamp: '1 day ago',
    type: 'assignment',
    read: true,
  }
];

export const INITIAL_AI_CONFIG: AIModelConfig = {
  activeModel: 'gemini-3.6-flash',
  temperature: 0.3,
  topP: 0.9,
  enableThinking: true,
};
