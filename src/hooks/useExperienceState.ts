import { create } from 'zustand';

export type ExperiencePhase = 
  | 'INTRO'
  | 'ELEVATOR'
  | 'SELECTED_FLOOR'
  | 'TRAVELLING'
  | 'DOORS_OPENING'
  | 'DISCOVERY'
  | 'ENDING';

export type DiscoveredObject = 'laptop' | 'phone' | 'chai' | 'idol';

interface ExperienceState {
  phase: ExperiencePhase;
  setPhase: (phase: ExperiencePhase) => void;
  
  selectedFloor: number | null;
  setSelectedFloor: (floor: number) => void;
  
  discoveredObjects: DiscoveredObject[];
  discoverObject: (obj: DiscoveredObject) => void;
  
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  
  volume: number;
  setVolume: (volume: number) => void;
  
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  
  xrAvailable: boolean;
  setXrAvailable: (available: boolean) => void;

  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  focusObject: string | null;
  setFocusObject: (id: string | null) => void;

  reset: () => void;
}

export const useExperienceState = create<ExperienceState>((set) => ({
  phase: 'INTRO',
  setPhase: (phase) => set({ phase }),
  
  selectedFloor: null,
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),
  
  discoveredObjects: [],
  discoverObject: (obj) => set((state) => {
    if (!state.discoveredObjects.includes(obj)) {
      return { discoveredObjects: [...state.discoveredObjects, obj] };
    }
    return state;
  }),
  
  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  
  volume: 1,
  setVolume: (volume) => set({ volume }),
  
  reducedMotion: false,
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  
  xrAvailable: false,
  setXrAvailable: (available) => set({ xrAvailable: available }),

  demoMode: false,
  setDemoMode: (demoMode) => set({ demoMode }),

  focusObject: null,
  setFocusObject: (id) => set({ focusObject: id }),

  reset: () => set({
    phase: 'INTRO',
    selectedFloor: null,
    discoveredObjects: [],
    focusObject: null,
  })
}));
