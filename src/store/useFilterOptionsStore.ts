import { create } from 'zustand';
import {
  distanceRanges,
  priceRanges,
  ratingRanges,
  typeCategories,
} from '../data';
import { FilterOption, FilterOptionType } from '../types';

interface FilterOptionsState {
  filters: FilterOptionType;
  getFilterLabels: (filterType: FilterOption) => string[];
  getFilterSublabels: (filterType: FilterOption) => string[];
}

const filters: FilterOptionType = {
  [FilterOption.Distance]: distanceRanges,
  [FilterOption.Price]: priceRanges,
  [FilterOption.Rating]: ratingRanges,
  [FilterOption.Type]: typeCategories,
};

export const useFilterOptionsStore = create<FilterOptionsState>((_, get) => ({
  filters: filters,

  getFilterLabels: (filterType: FilterOption) => {
    return get().filters[filterType].map((item) => item.label);
  },

  getFilterSublabels: (filterType: FilterOption) => {
    return get().filters[filterType].map((item) => item.sublabel ?? '');
  },
}));
