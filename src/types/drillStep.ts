import { Accommodation, FilterOption } from '../types';

export type DrillStep = {
  stepNumber: number;
  label: string;
  xAxisFilter: FilterOption;
  yAxisFilter: FilterOption;
  xAxisFilterAfter: FilterOption;
  yAxisFilterAfter: FilterOption;
  filterState: {
    [FilterOption.Distance]: Subrange | null;
    [FilterOption.Price]: Subrange | null;
    [FilterOption.Rating]: Subrange | null;
    [FilterOption.Type]: Subrange | null;
  };
  carouselDataSnapshot: Accommodation[];
};

export type NewDrillStep = Omit<DrillStep, 'stepNumber'>;

export type Subrange = {
  label: string;
  sublabel?: string;
  lowerBound: number | null;
  upperBound: number | null;
  subranges?: Subrange[];
};
