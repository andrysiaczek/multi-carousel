import { create } from 'zustand';
import { decisionChips } from '../utils';

interface DecisionChipsState {
  availableChips: string[];
  selectedChips: string[];
  setAvailableChips: (chips: string[]) => void;
  toggleChip: (chip: string) => void;
  resetChips: () => void;
}

export const useDecisionChipsStore = create<DecisionChipsState>((set) => ({
  availableChips: decisionChips,
  selectedChips: [],

  setAvailableChips: (chips) => set({ availableChips: chips }),

  toggleChip: (chip) =>
    set((state) => ({
      selectedChips: state.selectedChips.includes(chip)
        ? state.selectedChips.filter((c) => c !== chip) // Remove if already selected
        : [...state.selectedChips, chip], // Add if not selected
    })),

  resetChips: () => set({ selectedChips: [] }),
}));
