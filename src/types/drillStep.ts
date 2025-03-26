import { Accommodation, FilterOption, Subrange } from '../types';

export type DrillStep = {
  stepNumber: number;
  label: string;
  xAxisFilter: FilterOption;
  yAxisFilter: FilterOption;
  filterState: {
    [FilterOption.Distance]: Subrange | null;
    [FilterOption.Price]: Subrange | null;
    [FilterOption.Rating]: Subrange | null;
    [FilterOption.Type]: Subrange | null;
  };
  carouselDataSnapshot: Accommodation[];
};

export type NewDrillStep = Omit<DrillStep, 'stepNumber'>;
