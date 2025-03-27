import { create } from 'zustand';
import { FilterOption } from '../types';

interface AxisFilterState {
  xAxisFilter: FilterOption;
  yAxisFilter: FilterOption;
  chosenType: string | null;

  setXAxisFilter: (xAxisFilter: FilterOption) => void;
  setYAxisFilter: (yAxisFilter: FilterOption) => void;
  setAxisFilters: (
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption
  ) => void;
  setChosenType: (chosenType: string | null) => void;
  setAxisFiltersAndType: (
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    chosenType: string | null
  ) => void;
  resetAxisFiltersAndType: () => void;
}

const initialAxisFilterState = {
  xAxisFilter: FilterOption.Price,
  yAxisFilter: FilterOption.Rating,
  chosenType: null,
};

export const useAxisFilterStore = create<AxisFilterState>((set, get) => ({
  ...initialAxisFilterState,

  setXAxisFilter: (xAxisFilter) => {
    // Ensure mutual exclusion with Y-axis
    if (xAxisFilter !== get().yAxisFilter) set({ xAxisFilter });
  },
  setYAxisFilter: (yAxisFilter) => {
    // Ensure mutual exclusion with X-axis
    if (yAxisFilter !== get().xAxisFilter) set({ yAxisFilter });
  },
  setAxisFilters: (xAxisFilter, yAxisFilter) => {
    // Ensure mutual exclusion
    if (xAxisFilter !== yAxisFilter)
      set({
        xAxisFilter: xAxisFilter,
        yAxisFilter: yAxisFilter,
      });
  },
  setChosenType: (chosenType) => set({ chosenType }),
  setAxisFiltersAndType: (xAxisFilter, yAxisFilter, chosenType) => {
    // Ensure mutual exclusion
    if (xAxisFilter !== yAxisFilter)
      set({
        xAxisFilter,
        yAxisFilter,
        chosenType,
      });
  },
  resetAxisFiltersAndType: () => set(initialAxisFilterState),
}));
