export enum FilterOption {
  Distance = 'distance',
  Price = 'price',
  Rating = 'rating',
  Type = 'type',
}

export type FilterOptionType = Record<
  FilterOption.Distance | FilterOption.Price | FilterOption.Rating,
  Subrange[]
> &
  Record<FilterOption.Type, string[]>;

export type Subrange = {
  label: string;
  sublabel?: string;
  lowerBound: number;
  upperBound: number;
  subranges?: Subrange[];
};
