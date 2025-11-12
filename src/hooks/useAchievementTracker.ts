import { useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { useAchievementStore } from '@/store/useAchievementStore'
import { useJubeeStore } from '@/store/useJubeeStore'
import { toast } from '@/hooks/use-toast'

export function useAchievementTracker() {
  const { score, completedActivities } = useGameStore()
  const {
    initializeAchievements,
    checkAndUnlockAchievements,
    updateStreak,
    trackSpecialAchievement,
    achievements
  } = useAchievementStore()
  const { speak } = useJubeeStore()

  // Initialize achievements on first load
  useEffect(() => {
    initializeAchievements()
  }, [initializeAchievements])

  // Check for new achievements whenever game state changes
  const checkAchievements = useCallback(() => {
    const newAchievements = checkAndUnlockAchievements({
      score,
      completedActivities
    })

    // Show notifications for newly unlocked achievements
    newAchievements.forEach(achievement => {
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${achievement.emoji} ${achievement.name}: ${achievement.description}`,
        duration: 5000
      })

      speak(`Amazing! You unlocked ${achievement.name}!`)
    })
  }, [score, completedActivities, checkAndUnlockAchievements, speak])

  // Track activity completion for streaks
  const trackActivity = useCallback(() => {
    updateStreak()
    
    // Check for time-based special achievements
    const hour = new Date().getHours()
    if (hour < 9) {
      trackSpecialAchievement('earlyBird')
    } else if (hour >= 20) {
      trackSpecialAchievement('nightOwl')
    }

    // Check for new achievements after tracking
    checkAchievements()
  }, [updateStreak, trackSpecialAchievement, checkAchievements])

  // Track perfect score achievements
  const trackPerfectScore = useCallback(() => {
    trackSpecialAchievement('perfectScore')
    checkAchievements()
  }, [trackSpecialAchievement, checkAchievements])

  return {
    trackActivity,
    trackPerfectScore,
    checkAchievements,
    achievements
  }
}
