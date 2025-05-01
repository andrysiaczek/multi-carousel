import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FilterOptionWithFeature } from '../types';

interface FilterSidebarState {
  filters: {
    [FilterOptionWithFeature.Distance]: [number, number];
    [FilterOptionWithFeature.Price]: [number, number];
    [FilterOptionWithFeature.Rating]: [number, number];
    [FilterOptionWithFeature.Type]: string[];
    [FilterOptionWithFeature.Feature]: string[];
  };
  setNumericalFilter: (
    key:
      | FilterOptionWithFeature.Distance
      | FilterOptionWithFeature.Price
      | FilterOptionWithFeature.Rating,
    value: [number, number]
  ) => void;
  addStringFilter: (
    key: FilterOptionWithFeature.Type | FilterOptionWithFeature.Feature,
    value: string
  ) => void;
  removeStringFilter: (
    key: FilterOptionWithFeature.Type | FilterOptionWithFeature.Feature,
    value: string
  ) => void;
  resetFilter: (key: FilterOptionWithFeature) => void;
  resetState: () => void;
}

export const initialFilterSidebarState: FilterSidebarState['filters'] = {
  [FilterOptionWithFeature.Distance]: [0, 10],
  [FilterOptionWithFeature.Price]: [15, 600],
  [FilterOptionWithFeature.Rating]: [1.0, 5.0],
  [FilterOptionWithFeature.Type]: [],
  [FilterOptionWithFeature.Feature]: [],
};

export const useFilterSidebarStore = create<FilterSidebarState>()(
  persist(
    (set) => ({
      filters: initialFilterSidebarState,

      setNumericalFilter: (key, value) =>
        set((state) => {
          state.filters[key] = value;
          return state;
        }),

      addStringFilter: (key, value) =>
        set((state) => {
          const currentFeatures = state.filters[key];
          if (!currentFeatures.includes(value)) {
            state.filters[key] = [...currentFeatures, value];
          }
          return state;
        }),

      removeStringFilter: (key, value) =>
        set((state) => {
          state.filters[key] = state.filters[key].filter(
            (feature) => feature !== value
          );
          return state;
        }),

      resetFilter: (key) =>
        set((state) => {
          return {
            filters: {
              ...state.filters,
              [key]: initialFilterSidebarState[key],
            },
          };
        }),

      resetState: () =>
        set((state) => {
          state.filters[FilterOptionWithFeature.Distance] =
            initialFilterSidebarState[FilterOptionWithFeature.Distance];
          state.filters[FilterOptionWithFeature.Price] =
            initialFilterSidebarState[FilterOptionWithFeature.Price];
          state.filters[FilterOptionWithFeature.Rating] =
            initialFilterSidebarState[FilterOptionWithFeature.Rating];
          state.filters[FilterOptionWithFeature.Type] = [];
          state.filters[FilterOptionWithFeature.Feature] = [];
          return state;
        }),
    }),
    {
      name: 'filter-sidebar-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
