import { AchievementDefinition } from '@/types/achievements'

export const achievementDefinitions: AchievementDefinition[] = [
  // Activity Achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first activity',
    emoji: '👣',
    category: 'activity',
    requirement: 1,
    checkCondition: (state) => state.totalActivitiesCompleted >= 1
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Complete 5 activities',
    emoji: '🗺️',
    category: 'activity',
    requirement: 5,
    checkCondition: (state) => state.totalActivitiesCompleted >= 5
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    description: 'Complete 10 activities',
    emoji: '🎒',
    category: 'activity',
    requirement: 10,
    checkCondition: (state) => state.totalActivitiesCompleted >= 10
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Complete 25 activities',
    emoji: '🏆',
    category: 'activity',
    requirement: 25,
    checkCondition: (state) => state.totalActivitiesCompleted >= 25
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Complete 50 activities',
    emoji: '👑',
    category: 'activity',
    requirement: 50,
    checkCondition: (state) => state.totalActivitiesCompleted >= 50
  },

  // Streak Achievements
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Keep a 3-day streak',
    emoji: '🔥',
    category: 'streak',
    requirement: 3,
    checkCondition: (state) => state.currentStreak >= 3
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Keep a 7-day streak',
    emoji: '🔥🔥',
    category: 'streak',
    requirement: 7,
    checkCondition: (state) => state.currentStreak >= 7
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Keep a 14-day streak',
    emoji: '🔥🔥🔥',
    category: 'streak',
    requirement: 14,
    checkCondition: (state) => state.currentStreak >= 14
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'Keep a 30-day streak',
    emoji: '💎',
    category: 'streak',
    requirement: 30,
    checkCondition: (state) => state.currentStreak >= 30
  },

  // Milestone Achievements
  {
    id: 'rookie',
    name: 'Rookie',
    description: 'Earn 100 points',
    emoji: '⭐',
    category: 'milestone',
    requirement: 100,
    checkCondition: (state) => state.score >= 100
  },
  {
    id: 'skilled',
    name: 'Skilled',
    description: 'Earn 500 points',
    emoji: '✨',
    category: 'milestone',
    requirement: 500,
    checkCondition: (state) => state.score >= 500
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Earn 1000 points',
    emoji: '🌟',
    category: 'milestone',
    requirement: 1000,
    checkCondition: (state) => state.score >= 1000
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Earn 2500 points',
    emoji: '💫',
    category: 'milestone',
    requirement: 2500,
    checkCondition: (state) => state.score >= 2500
  },
  {
    id: 'grand_master',
    name: 'Grand Master',
    description: 'Earn 5000 points',
    emoji: '🌠',
    category: 'milestone',
    requirement: 5000,
    checkCondition: (state) => state.score >= 5000
  },

  // Special Achievements
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete an activity before 9 AM',
    emoji: '🌅',
    category: 'special',
    requirement: 1,
    checkCondition: () => false // Tracked separately
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete an activity after 8 PM',
    emoji: '🦉',
    category: 'special',
    requirement: 1,
    checkCondition: () => false // Tracked separately
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 5 activities with perfect scores',
    emoji: '💯',
    category: 'special',
    requirement: 5,
    checkCondition: () => false // Tracked separately
  }
]
