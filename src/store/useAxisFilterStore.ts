import { create } from 'zustand';
import { FilterOption } from '../types';

interface AxisFilterState {
  xAxisFilter: FilterOption;
  yAxisFilter: FilterOption;
  chosenType: string | null;

  setXAxisFilter: (filter: FilterOption) => void;
  setYAxisFilter: (filter: FilterOption) => void;
  setChosenType: (type: string | null) => void;
}

export const useAxisFilterStore = create<AxisFilterState>((set, get) => ({
  xAxisFilter: FilterOption.Price,
  yAxisFilter: FilterOption.Rating,
  chosenType: null,

  setXAxisFilter: (filter) => {
    // Ensure mutual exclusion with Y-axis
    if (filter !== get().yAxisFilter) {
      set({ xAxisFilter: filter });
    }
  },
  setYAxisFilter: (filter) => {
    // Ensure mutual exclusion with X-axis
    if (filter !== get().xAxisFilter) {
      set({ yAxisFilter: filter });
    }
  },
  setChosenType: (type) => set({ chosenType: type }),
}));
