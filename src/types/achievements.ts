export type AchievementCategory = 'activity' | 'streak' | 'milestone' | 'special'

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  category: AchievementCategory
  requirement: number
  earned: boolean
  earnedAt?: Date
  progress: number
}

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  emoji: string
  category: AchievementCategory
  requirement: number
  checkCondition: (state: {
    score: number
    completedActivities: string[]
    currentStreak: number
    totalActivitiesCompleted: number
  }) => boolean
}
