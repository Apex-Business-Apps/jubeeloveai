import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type Theme = 'morning' | 'afternoon' | 'evening' | 'night'

interface GameState {
  currentTheme: Theme
  score: number
  stickers: string[]
  completedActivities: string[]
  updateTheme: (theme: Theme) => void
  addScore: (points: number) => void
  addSticker: (stickerId: string) => void
  markActivityComplete: (activityId: string) => void
  onActivityComplete?: () => void // Callback for achievement tracking
  setActivityCompleteCallback: (callback: () => void) => void
}

export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      currentTheme: 'morning',
      score: 0,
      stickers: [],
      completedActivities: [],
      onActivityComplete: undefined,
      updateTheme: (theme) => set((state) => { state.currentTheme = theme }),
      addScore: (points) => {
        set((state) => { state.score += points })
        const callback = get().onActivityComplete
        if (callback) callback()
      },
      addSticker: (stickerId) => set((state) => {
        if (!state.stickers.includes(stickerId)) {
          state.stickers.push(stickerId)
        }
      }),
      markActivityComplete: (activityId) => {
        set((state) => {
          if (!state.completedActivities.includes(activityId)) {
            state.completedActivities.push(activityId)
          }
        })
        const callback = get().onActivityComplete
        if (callback) callback()
      },
      setActivityCompleteCallback: (callback) => set((state) => {
        state.onActivityComplete = callback
      })
    })),
    { name: 'jubeelove-game-storage' }
  )
)
