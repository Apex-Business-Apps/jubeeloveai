import { useCallback } from 'react'
import { useJubeeStore } from '@/store/useJubeeStore'

/**
 * Shared controller for Jubee narration
 * Ensures only one narration is active at a time.
 */
export function useJubeeNarrator() {
  const speak = useJubeeStore((state) => state.speak)
  const stopSpeech = useJubeeStore((state) => state.stopSpeech)

  const speakOnce = useCallback((text: string, mood?: Parameters<typeof speak>[1]) => {
    return speak(text, mood)
  }, [speak])

  const stop = useCallback(() => {
    stopSpeech()
  }, [stopSpeech])

  return { speak: speakOnce, stop }
}
