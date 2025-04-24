import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { accommodationDataset } from '../data';
import { Accommodation, SortOption } from '../types';
import { sortAccommodations } from '../utils';

interface SortState {
  sortField: SortOption;
  sortAscending: boolean;
  accommodations: Accommodation[];
  setSortField: (field: SortOption) => void;
  setSortDirection: (ascending: boolean) => void;
  setAccommodations: (accommodations: Accommodation[]) => void;
}

export const useSortStore = create<SortState>()(
  persist(
    (set) => ({
      sortField: SortOption.Price,
      sortAscending: true,
      accommodations: sortAccommodations(
        accommodationDataset,
        SortOption.Price,
        true
      ),

      setSortField: (field) =>
        set((state) => {
          if (state.sortField === field) return state;
          return {
            sortField: field,
            accommodations: sortAccommodations(
              state.accommodations,
              field,
              state.sortAscending
            ),
          };
        }),

      setSortDirection: (ascending) =>
        set((state) => {
          if (state.sortAscending === ascending) return state;
          return {
            sortAscending: ascending,
            accommodations: sortAccommodations(
              state.accommodations,
              state.sortField,
              ascending
            ),
          };
        }),

      setAccommodations: (accommodations) =>
        set((state) => ({
          accommodations: sortAccommodations(
            accommodations,
            state.sortField,
            state.sortAscending
          ),
        })),
    }),
    {
      name: 'sort-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
