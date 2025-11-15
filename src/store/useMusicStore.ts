import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MusicState {
  // Persistent state
  lastSongId: string | null
  volume: number
  selectedGenre: string
  karaokeMode: boolean
  lastPosition: number
  
  // Actions
  setLastSongId: (id: string | null) => void
  setVolume: (volume: number) => void
  setSelectedGenre: (genre: string) => void
  setKaraokeMode: (enabled: boolean) => void
  setLastPosition: (position: number) => void
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      lastSongId: null,
      volume: 0.7,
      selectedGenre: 'all',
      karaokeMode: false,
      lastPosition: 0,
      
      setLastSongId: (id) => set({ lastSongId: id }),
      setVolume: (volume) => set({ volume }),
      setSelectedGenre: (genre) => set({ selectedGenre: genre }),
      setKaraokeMode: (enabled) => set({ karaokeMode: enabled }),
      setLastPosition: (position) => set({ lastPosition: position }),
    }),
    { name: 'jubeelove-music-storage' }
  )
)
