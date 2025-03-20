import { create } from 'zustand';
import {
  distanceRanges,
  priceRanges,
  ratingRanges,
  typeCategories,
} from '../data/filterOptions';
import { FilterOption, FilterOptionType, Subrange } from '../data/types';

interface FilterOptionsState {
  filters: FilterOptionType;
  getFilterLabels: (filterType: FilterOption) => string[];
  getFilterSublabels: (filterType: FilterOption) => string[];
}

export const useFilterOptionsStore = create<FilterOptionsState>((_, get) => ({
  filters: {
    [FilterOption.Distance]: distanceRanges as Subrange[],
    [FilterOption.Price]: priceRanges as Subrange[],
    [FilterOption.Rating]: ratingRanges as Subrange[],
    [FilterOption.Type]: typeCategories as string[],
  },

  getFilterLabels: (filterType: FilterOption) => {
    const filterData = get().filters[filterType];

    if (filterType === FilterOption.Type) {
      return filterData as string[];
    }

    if (Array.isArray(filterData) && typeof filterData[0] === 'object') {
      return (filterData as Subrange[]).map((item) => item.label);
    }

    return [];
  },

  getFilterSublabels: (filterType: FilterOption) => {
    const filterData = get().filters[filterType];

    if (filterType === FilterOption.Type) {
      return [];
    }

    if (Array.isArray(filterData) && typeof filterData[0] === 'object') {
      return (filterData as Subrange[]).map((item) => item.sublabel ?? '');
    }

    return [];
  },
}));
