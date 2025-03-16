import { create } from "zustand";

interface FilterState {
  xAxisCategory: string | null;
  yAxisCategory: string | null;
  additionalFilters: string[];

  setXAxisCategory: (category: string) => void;
  setYAxisCategory: (category: string) => void;
  toggleAdditionalFilter: (filter: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  xAxisCategory: null,
  yAxisCategory: null,
  additionalFilters: [],

  setXAxisCategory: (category) => set({ xAxisCategory: category }),
  setYAxisCategory: (category) => set({ yAxisCategory: category }),
  toggleAdditionalFilter: (filter) =>
    set((state) => ({
      additionalFilters: state.additionalFilters.includes(filter)
        ? state.additionalFilters.filter((f) => f !== filter)
        : [...state.additionalFilters, filter],
    })),
  resetFilters: () =>
    set({
      xAxisCategory: null,
      yAxisCategory: null,
      additionalFilters: [],
    }),
}));
