import { create } from 'zustand';

interface DecisionChipsState {
  selectedChips: string[];
  toggleChip: (chip: string) => void;
  resetChips: () => void;
}

export const useDecisionChipsStore = create<DecisionChipsState>((set) => ({
  selectedChips: [],

  toggleChip: (chip) =>
    set((state) => ({
      selectedChips: state.selectedChips.includes(chip)
        ? state.selectedChips.filter((c) => c !== chip) // Remove if already selected
        : [...state.selectedChips, chip], // Add if not selected
    })),

  resetChips: () => set({ selectedChips: [] }), // Reset all filters
}));
