import { create } from 'zustand';
import filterOptionsData from '../data/filterOptions.json'; // Import JSON file

export interface Subrange {
  label: string;
  subranges?: Subrange[];
}

interface FilterOptions {
  [key: string]: Subrange[] | string[];
  price: Subrange[];
  reviews: Subrange[];
  distance: Subrange[];
  type: string[];
}

interface FilterOptionsState {
  filterOptions: FilterOptions;
}

export const useFilterOptionsStore = create<FilterOptionsState>(() => ({
  filterOptions: filterOptionsData as FilterOptions,
}));
