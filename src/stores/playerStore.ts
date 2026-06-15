import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  isFullscreen: boolean;
  isTheaterMode: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  setPlaying: (playing: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  setTheaterMode: (theater: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isFullscreen: false,
  isTheaterMode: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setTheaterMode: (theater) => set({ isTheaterMode: theater }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
}));
