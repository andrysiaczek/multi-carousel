import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { EventType } from '../firebase';
import { useStudyStore } from '../store';
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
  resetState: () => void;
}

const initialAxisFilterState = {
  xAxisFilter: FilterOption.Price,
  yAxisFilter: FilterOption.Rating,
  chosenType: null,
};

export const useAxisFilterStore = create<AxisFilterState>()(
  persist(
    (set, get) => ({
      ...initialAxisFilterState,

      setXAxisFilter: (xAxisFilter) => {
        // Ensure mutual exclusion with Y-axis
        if (xAxisFilter !== get().yAxisFilter) {
          useStudyStore.getState().logEvent(EventType.FilterApply, {
            filterType: xAxisFilter,
            axis: 'x',
          });
          set({ xAxisFilter });
        }
      },
      setYAxisFilter: (yAxisFilter) => {
        // Ensure mutual exclusion with X-axis
        if (yAxisFilter !== get().xAxisFilter) {
          useStudyStore.getState().logEvent(EventType.FilterApply, {
            filterType: yAxisFilter,
            axis: 'y',
          });
          set({ yAxisFilter });
        }
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
      resetState: () => set(initialAxisFilterState),
    }),
    {
      name: 'axis-filter-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
