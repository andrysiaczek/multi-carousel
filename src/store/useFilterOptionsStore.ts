import { create } from 'zustand';
import {
  distanceRanges,
  priceRanges,
  ratingRanges,
  typeCategories,
} from '../data';
import { FilterOption, Subrange } from '../types';

type FilterOptionType = Record<FilterOption, Subrange[]>;

interface FilterOptionsState {
  filters: FilterOptionType;
}

const filters: FilterOptionType = {
  [FilterOption.Distance]: distanceRanges,
  [FilterOption.Price]: priceRanges,
  [FilterOption.Rating]: ratingRanges,
  [FilterOption.Type]: typeCategories,
};

export const useFilterOptionsStore = create<FilterOptionsState>(() => ({
  filters: filters,
}));
