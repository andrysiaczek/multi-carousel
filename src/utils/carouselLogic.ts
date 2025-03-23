import {
  useAxisFilterStore,
  useCarouselStore,
  useDecisionChipsStore,
} from '../store';
import {
  Accommodation,
  Axis,
  CarouselCell,
  FilterOption,
  FilterOptionType,
  Subrange,
} from '../types';
import {
  filterAccommodations,
  findSubrangeByLabel,
  getFallbackFilter,
} from '../utils';

export const buildCarouselGrid = (
  xRanges: Subrange[],
  yRanges: Subrange[],
  data: Accommodation[],
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  selectedChips: string[] = []
): { carousel: CarouselCell[][]; accommodations: Accommodation[] } => {
  const carousel: CarouselCell[][] = [];
  const accommodations: Accommodation[] = [];

  for (let row = 0; row < yRanges.length; row++) {
    carousel[row] = [];
    for (let col = 0; col < xRanges.length; col++) {
      const xRange = xRanges[col];
      const yRange = yRanges[row];

      let filtered = filterAccommodations(
        data,
        xRange,
        yRange,
        xAxisFilter,
        yAxisFilter
      );

      for (const acc of filtered) {
        if (!accommodations.some((a) => a.id === acc.id)) {
          accommodations.push(acc);
        }
      }

      // Apply Decision Chips as a second filtering layer
      if (selectedChips.length > 0) {
        filtered = filtered.filter((acc) =>
          selectedChips.every((chip) => acc.features?.includes(chip))
        );
      }

      carousel[row][col] = {
        row,
        column: col,
        accommodations: filtered,
      };
    }
  }

  return { carousel, accommodations };
};

export const drillDownCell = (
  colIndex: number,
  rowIndex: number,
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  filters: FilterOptionType
) => {
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();
  const { selectedChips } = useDecisionChipsStore.getState();

  const colLabel = columnRanges[colIndex].label;
  const rowLabel = rowRanges[rowIndex].label;

  const xParent = findSubrangeByLabel(filters[xAxisFilter], colLabel);
  const yParent = findSubrangeByLabel(filters[yAxisFilter], rowLabel);

  const isXType = xAxisFilter === FilterOption.Type;
  const isYType = yAxisFilter === FilterOption.Type;

  const updateState = (result: ReturnType<typeof handleTypeDrill>) =>
    useCarouselStore.setState({
      columnOffset: 0,
      rowOffset: 0,
      columnRanges: result.xRanges,
      rowRanges: result.yRanges,
      dataPerCell: result.carousel,
      carouselData: result.accommodations,
    });

  // X Type
  if (isXType && yParent?.subranges) {
    const result = handleTypeDrill({
      type: colLabel,
      axis: Axis.X,
      otherFilter: yAxisFilter,
      otherAxisRanges: yParent.subranges,
      filters,
      data: carouselData,
    });

    useAxisFilterStore
      .getState()
      .setAxisFiltersAndType(result.xAxis, result.yAxis, colLabel);
    return updateState(result);
  }

  // Y Type
  if (isYType && xParent?.subranges) {
    const result = handleTypeDrill({
      type: rowLabel,
      axis: Axis.Y,
      otherFilter: xAxisFilter,
      otherAxisRanges: xParent.subranges,
      filters,
      data: carouselData,
    });

    useAxisFilterStore
      .getState()
      .setAxisFiltersAndType(result.xAxis, result.yAxis, rowLabel);
    return updateState(result);
  }

  // Normal double-subrange drill
  if (!xParent?.subranges || !yParent?.subranges) {
    return console.warn('No subranges to drill into for selected cell.');
  }

  const { carousel, accommodations } = buildCarouselGrid(
    xParent.subranges,
    yParent.subranges,
    carouselData,
    xAxisFilter,
    yAxisFilter,
    selectedChips
  );

  useCarouselStore.setState({
    columnOffset: 0,
    rowOffset: 0,
    columnRanges: xParent.subranges,
    rowRanges: yParent.subranges,
    dataPerCell: carousel,
    carouselData: accommodations,
  });
};

export const drillDownColumn = (
  colIndex: number,
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  filters: FilterOptionType
) => {
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();
  const { selectedChips } = useDecisionChipsStore.getState();
  const label = columnRanges[colIndex].label;
  const parentRange = findSubrangeByLabel(filters[xAxisFilter], label);

  if (!parentRange?.subranges) {
    if (xAxisFilter === FilterOption.Type) {
      const result = handleTypeDrill({
        type: label,
        axis: Axis.X,
        otherFilter: yAxisFilter,
        otherAxisRanges: rowRanges,
        filters,
        data: carouselData,
      });

      useAxisFilterStore
        .getState()
        .setAxisFiltersAndType(result.xAxis, result.yAxis, label);

      return useCarouselStore.setState({
        columnOffset: 0,
        columnRanges: result.xRanges,
        dataPerCell: result.carousel,
        carouselData: result.accommodations,
      });
    } else {
      return console.warn('No subranges to drill into for selected column.');
    }
  }

  const { carousel, accommodations } = buildCarouselGrid(
    parentRange.subranges,
    rowRanges,
    carouselData,
    xAxisFilter,
    yAxisFilter,
    selectedChips
  );

  useCarouselStore.setState({
    columnOffset: 0,
    columnRanges: parentRange.subranges,
    dataPerCell: carousel,
    carouselData: accommodations,
  });
};

export const drillDownRow = (
  rowIndex: number,
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption,
  filters: FilterOptionType
) => {
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();
  const { selectedChips } = useDecisionChipsStore.getState();
  const label = rowRanges[rowIndex].label;
  const parentRange = findSubrangeByLabel(filters[yAxisFilter], label);

  if (!parentRange?.subranges) {
    if (yAxisFilter === FilterOption.Type) {
      const result = handleTypeDrill({
        type: label,
        axis: Axis.Y,
        otherFilter: xAxisFilter,
        otherAxisRanges: columnRanges,
        filters,
        data: carouselData,
      });

      useAxisFilterStore
        .getState()
        .setAxisFiltersAndType(result.xAxis, result.yAxis, label);

      return useCarouselStore.setState({
        rowOffset: 0,
        rowRanges: result.yRanges,
        dataPerCell: result.carousel,
        carouselData: result.accommodations,
      });
    } else {
      return console.warn('No subranges to drill into for selected row.');
    }
  }

  const { carousel, accommodations } = buildCarouselGrid(
    columnRanges,
    parentRange.subranges,
    carouselData,
    xAxisFilter,
    yAxisFilter,
    selectedChips
  );

  useCarouselStore.setState({
    rowOffset: 0,
    rowRanges: parentRange.subranges,
    dataPerCell: carousel,
    carouselData: accommodations,
  });
};

export const handleTypeDrill = ({
  type,
  axis,
  otherFilter,
  otherAxisRanges,
  filters,
  data,
}: {
  type: string;
  axis: Axis;
  otherFilter: FilterOption;
  otherAxisRanges: Subrange[];
  filters: FilterOptionType;
  data: Accommodation[];
}) => {
  const { selectedChips } = useDecisionChipsStore.getState();
  const filteredData = data.filter((acc) => acc.type === type);
  const fallbackAxis = getFallbackFilter(axis, otherFilter);
  // TODO: FilterHistory: Retrieve the last selected subrange for this axis from filter history
  const newRanges = filters[fallbackAxis];

  const isXType = axis === Axis.X;

  const { carousel, accommodations } = buildCarouselGrid(
    isXType ? newRanges : otherAxisRanges,
    isXType ? otherAxisRanges : newRanges,
    filteredData,
    isXType ? fallbackAxis : otherFilter,
    isXType ? otherFilter : fallbackAxis,
    selectedChips
  );

  return {
    carousel,
    accommodations,
    xAxis: isXType ? fallbackAxis : otherFilter,
    yAxis: isXType ? otherFilter : fallbackAxis,
    xRanges: isXType ? newRanges : otherAxisRanges,
    yRanges: isXType ? otherAxisRanges : newRanges,
  };
};
