import { create } from 'zustand';

interface AxisFilterState {
  xAxis: string;
  yAxis: string;
  chosenType: string | null;

  setXAxis: (filter: string) => void;
  setYAxis: (filter: string) => void;
  setChosenType: (type: string | null) => void; // can also reset type
}

export const useAxisFilterStore = create<AxisFilterState>((set, get) => ({
  xAxis: 'Price',
  yAxis: 'Reviews',
  chosenType: null,

  setXAxis: (filter) => {
    // Ensure mutual exclusion with Y-axis
    if (filter !== get().yAxis) {
      set({ xAxis: filter });
    }
  },
  setYAxis: (filter) => {
    // Ensure mutual exclusion with X-axis
    if (filter !== get().xAxis) {
      set({ yAxis: filter });
    }
  },
  setChosenType: (type) => set({ chosenType: type }),
}));
