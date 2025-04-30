import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { accommodationDataset } from '../data';
import { EventType } from '../firebase';
import { useStudyStore } from '../store';
import { Accommodation, SortOption } from '../types';
import { sortAccommodations } from '../utils';

interface SortState {
  sortField: SortOption;
  sortAscending: boolean;
  accommodations: Accommodation[];
  setSortField: (field: SortOption) => void;
  setSortDirection: (ascending: boolean) => void;
  setAccommodations: (accommodations: Accommodation[]) => void;
  resetState: () => void;
}

const initialSortState = {
  sortField: SortOption.Price,
  sortAscending: true,
  accommodations: sortAccommodations(
    accommodationDataset,
    SortOption.Price,
    true
  ),
};

export const useSortStore = create<SortState>()(
  persist(
    (set) => ({
      ...initialSortState,

      setSortField: (field) =>
        set((state) => {
          if (state.sortField === field) return state;

          useStudyStore.getState().logEvent(EventType.FilterApply, {
            filterType: state.sortField,
            sortDirection: state.sortAscending ? 'ascending' : 'descending',
          });

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

          useStudyStore.getState().logEvent(EventType.FilterApply, {
            filterType: state.sortField,
            sortDirection: state.sortAscending ? 'ascending' : 'descending',
          });

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

      resetState: () => set(initialSortState),
    }),
    {
      name: 'sort-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
