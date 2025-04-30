import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { EventType } from '../firebase';
import { useStudyStore } from '../store';
import { decisionChips } from '../utils';

interface DecisionChipsState {
  availableChips: string[];
  selectedChips: string[];
  setAvailableChips: (chips: string[]) => void;
  toggleChip: (chip: string) => void;
  resetChips: () => void;
  resetState: () => void;
}

const initialDecisionChipsState = {
  availableChips: decisionChips,
  selectedChips: [],
};

export const useDecisionChipsStore = create<DecisionChipsState>()(
  persist(
    (set) => ({
      ...initialDecisionChipsState,

      setAvailableChips: (chips) => set({ availableChips: chips }),

      toggleChip: (chip) =>
        set((state) => {
          const alreadySelected = state.selectedChips.includes(chip);

          useStudyStore
            .getState()
            .logEvent(
              alreadySelected ? EventType.FilterReset : EventType.FilterApply,
              {
                filterType: 'feature',
                filterValue: chip,
              }
            );

          return {
            selectedChips: alreadySelected
              ? state.selectedChips.filter((c) => c !== chip) // Remove if already selected
              : [...state.selectedChips, chip], // Add if not selected
          };
        }),

      resetChips: () => {
        useStudyStore.getState().logEvent(EventType.FilterResetAll, {
          scope: 'features',
        });

        return set({ selectedChips: [] });
      },

      resetState: () => set(initialDecisionChipsState),
    }),
    {
      name: 'decision-chips-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
