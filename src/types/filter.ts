export enum FilterOption {
  Distance = 'distance',
  Price = 'price',
  Rating = 'rating',
  Type = 'type',
}

export type FilterOptionType = Record<FilterOption, Subrange[]>;

export type Subrange = {
  label: string;
  sublabel?: string;
  lowerBound: number | null;
  upperBound: number | null;
  subranges?: Subrange[];
};
