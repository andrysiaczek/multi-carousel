import { create } from 'zustand';
import { useAxisFilterStore } from '../store';
import { DrillStep, FilterOption, NewDrillStep, Subrange } from '../types';
import { generateFilterLabel, restoreAxisFiltersFromStep } from '../utils';

interface FilterHistoryState {
  steps: DrillStep[];
  hoveredStep: string | null;

  getLastStep: () => DrillStep | null;
  getLastSubrange: (filter: FilterOption) => Subrange | null;

  addStep: (step: NewDrillStep) => void;
  goToStep: (index: number) => void;
  resetHistory: () => void;
  setHoveredStep: (firstRange: Subrange, secondRange?: Subrange) => void;
  resetHoveredStep: () => void;
}

export const useFilterHistoryStore = create<FilterHistoryState>((set, get) => ({
  steps: [],
  hoveredStep: null,

  getLastStep: () => {
    const steps = get().steps;
    return steps.length ? steps[steps.length - 1] : null;
  },

  getLastSubrange: (filter) => {
    return get().getLastStep()?.filterState[filter] || null;
  },

  addStep: (step) =>
    set((state) => ({
      steps: [
        ...state.steps,
        {
          ...step,
          stepNumber: state.steps.length,
        },
      ],
      hoveredStep: null,
    })),

  goToStep: (stepNumber) => {
    const steps = get().steps.slice(0, stepNumber + 1);
    set({ steps, hoveredStep: null });

    restoreAxisFiltersFromStep(steps.length ? steps[steps.length - 1] : null);
  },

  resetHistory: () => set({ steps: [], hoveredStep: null }),

  setHoveredStep: (firstRange, secondRange) => {
    const { xAxisFilter, yAxisFilter } = useAxisFilterStore.getState();
    const label = secondRange
      ? generateFilterLabel(xAxisFilter, firstRange, yAxisFilter, secondRange)
      : generateFilterLabel(xAxisFilter, firstRange);

    set({ hoveredStep: label });
  },

  resetHoveredStep: () => set({ hoveredStep: null }),
}));
