import { useAxisFilterStore, useFilterHistoryStore } from '../store';
import {
  Accommodation,
  Axis,
  DrillStep,
  FilterOption,
  Subrange,
} from '../types';
import { capitalize } from '../utils';

export const addStandardAxisDrillStep = (
  axis: Axis,
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  parentRange: Subrange,
  accommodations: Accommodation[]
) => {
  const filterHistoryStore = useFilterHistoryStore.getState();
  const lastStep = filterHistoryStore.getLastStep();
  const filter = axis === Axis.X ? xAxisFilter : yAxisFilter;

  filterHistoryStore.addStep({
    xAxisFilter,
    yAxisFilter,
    label: generateFilterLabel(filter, parentRange),
    filterState: {
      [FilterOption.Distance]:
        filter === FilterOption.Distance
          ? parentRange
          : lastStep?.filterState[FilterOption.Distance] ?? null,
      [FilterOption.Price]:
        filter === FilterOption.Price
          ? parentRange
          : lastStep?.filterState[FilterOption.Price] ?? null,
      [FilterOption.Rating]:
        filter === FilterOption.Rating
          ? parentRange
          : lastStep?.filterState[FilterOption.Rating] ?? null,
      [FilterOption.Type]: lastStep?.filterState[FilterOption.Type] ?? null,
    },
    carouselDataSnapshot: accommodations,
  });
};

export const addTypeAxisDrillStep = (
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  parentRange: Subrange | null,
  accommodations: Accommodation[]
) => {
  const filterHistoryStore = useFilterHistoryStore.getState();
  const lastStep = filterHistoryStore.getLastStep();

  filterHistoryStore.addStep({
    xAxisFilter,
    yAxisFilter,
    label: generateFilterLabel(FilterOption.Type, parentRange),
    filterState: {
      [FilterOption.Distance]:
        lastStep?.filterState[FilterOption.Distance] ?? null,
      [FilterOption.Price]: lastStep?.filterState[FilterOption.Price] ?? null,
      [FilterOption.Rating]: lastStep?.filterState[FilterOption.Rating] ?? null,
      [FilterOption.Type]: parentRange,
    },
    carouselDataSnapshot: accommodations,
  });
};

const formatRangeLabel = (filter: FilterOption, range: Subrange): string => {
  const euroUnicode = '\u20ac';
  const starUnicode = '\u2605';
  let lowerUnit = '',
    upperUnit = '';

  switch (filter) {
    case FilterOption.Distance:
      lowerUnit = range.lowerBound ? (range.lowerBound > 10 ? 'm' : 'km') : '';
      upperUnit = range.upperBound ? (range.upperBound > 10 ? 'm' : 'km') : '';
      break;
    case FilterOption.Price:
      lowerUnit = upperUnit = euroUnicode;
      break;
    case FilterOption.Rating:
      lowerUnit = upperUnit = starUnicode;
      break;
  }

  if (!range.lowerBound && !range.upperBound) return range.label;
  if (!range.lowerBound) return `less than ${range.upperBound}${upperUnit}`;
  if (!range.upperBound) return `above ${range.lowerBound}${lowerUnit}`;

  return `${range.lowerBound}${lowerUnit} - ${range.upperBound}${upperUnit}`;
};

export const generateFilterLabel = (
  firstFilter: FilterOption,
  firstRange: Subrange | null,
  secondFilter?: FilterOption,
  secondRange?: Subrange | null
) => {
  if (!firstRange) return '';

  const firstLabel = `${capitalize(firstFilter)}: ${formatRangeLabel(
    firstFilter,
    firstRange
  )}`;

  if (secondFilter && secondRange) {
    const secondLabel = `${capitalize(secondFilter)}: ${formatRangeLabel(
      secondFilter,
      secondRange
    )}`;
    return `${firstLabel}, ${secondLabel}`;
  }

  return firstLabel;
};

/**
 * Restores the axis filters and chosen type from a given step.
 * If no step is provided, resets the filters.
 */
export const restoreAxisFiltersFromStep = (step: DrillStep | null) => {
  const { resetAxisFiltersAndType, setAxisFilters, setChosenType } =
    useAxisFilterStore.getState();

  if (!step) return resetAxisFiltersAndType();

  if (!step.filterState[FilterOption.Type]) setChosenType(null);

  setAxisFilters(step.xAxisFilter, step.yAxisFilter);
};
