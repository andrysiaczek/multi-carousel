import { create } from 'zustand';

interface AxisFilterState {
  xAxisFilter: string;
  yAxisFilter: string;
  chosenType: string | null;

  setXAxisFilter: (filter: string) => void;
  setYAxisFilter: (filter: string) => void;
  setChosenType: (type: string | null) => void;
}

export const useAxisFilterStore = create<AxisFilterState>((set, get) => ({
  xAxisFilter: 'Price',
  yAxisFilter: 'Reviews',
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
