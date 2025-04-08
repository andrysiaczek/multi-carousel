import { FilterOption, Subrange } from '../../types';
import { default as distanceRanges } from './distanceRanges.json';
import { default as priceRanges } from './priceRanges.json';
import { default as ratingRanges } from './ratingRanges.json';
import { default as typeCategories } from './typeCategories.json';

export { typeCategories };
export const filters: Record<FilterOption, Subrange[]> = {
  [FilterOption.Distance]: distanceRanges,
  [FilterOption.Price]: priceRanges,
  [FilterOption.Rating]: ratingRanges,
  [FilterOption.Type]: typeCategories,
};
