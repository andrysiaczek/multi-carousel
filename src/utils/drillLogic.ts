import { filters } from '../data';
import {
  useAxisFilterStore,
  useCarouselStore,
  useFilterHistoryStore,
} from '../store';
import {
  Accommodation,
  Axis,
  DrillStep,
  FilterOption,
  Subrange,
} from '../types';
import {
  addStandardAxisDrillStep,
  addTypeAxisDrillStep,
  buildCarouselGrid,
  findSubrangeByLabel,
  generateFilterLabel,
  getFallbackFilter,
} from '../utils';

const drillDownAxis = (axis: Axis, index: number) => {
  const { xAxisFilter, yAxisFilter, setAxisFiltersAndType } =
    useAxisFilterStore.getState();
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();

  const isXAxis = axis === Axis.X;
  const prefix = isXAxis ? 'column' : 'row';
  const label = isXAxis ? columnRanges[index].label : rowRanges[index].label;
  const filter = isXAxis ? xAxisFilter : yAxisFilter;
  const otherFilter = isXAxis ? yAxisFilter : xAxisFilter;
  const parentRange = findSubrangeByLabel(
    useFilterHistoryStore.getState().getLastSubrange(filter)?.subranges ??
      filters[filter],
    label
  );

  if (!parentRange?.subranges) {
    if (filter === FilterOption.Type) {
      const result = drillDownTypeAxis({
        type: label,
        axis,
        otherFilter,
        otherAxisRanges: isXAxis ? rowRanges : columnRanges,
        data: carouselData,
      });

      setAxisFiltersAndType(result.xAxisFilter, result.yAxisFilter, label);

      useCarouselStore.setState({
        [`${prefix}Offset`]: 0,
        [`${prefix}Ranges`]: isXAxis ? result.xRanges : result.yRanges,
        dataPerCell: result.carousel,
        carouselData: result.accommodations,
      });

      addTypeAxisDrillStep(
        xAxisFilter,
        yAxisFilter,
        parentRange,
        result.accommodations
      );
      return;
    } else {
      return console.warn(`No subranges to drill into for selected ${prefix}.`);
    }
  }

  const { carousel, accommodations } = buildCarouselGrid(
    isXAxis ? parentRange.subranges : columnRanges,
    isXAxis ? rowRanges : parentRange.subranges,
    carouselData,
    xAxisFilter,
    yAxisFilter
  );

  useCarouselStore.setState({
    [`${prefix}Offset`]: 0,
    [`${prefix}Ranges`]: parentRange.subranges,
    dataPerCell: carousel,
    carouselData: accommodations,
  });

  addStandardAxisDrillStep(
    axis,
    xAxisFilter,
    yAxisFilter,
    parentRange,
    accommodations
  );
};

export const drillDownCell = (colIndex: number, rowIndex: number) => {
  const { xAxisFilter, yAxisFilter, setAxisFiltersAndType } =
    useAxisFilterStore.getState();
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();
  const { getLastStep, getLastSubrange, addStep } =
    useFilterHistoryStore.getState();

  const lastStep = getLastStep();

  const colLabel = columnRanges[colIndex].label;
  const rowLabel = rowRanges[rowIndex].label;

  const xParent = findSubrangeByLabel(
    getLastSubrange(xAxisFilter)?.subranges ?? filters[xAxisFilter],
    colLabel
  );
  const yParent = findSubrangeByLabel(
    getLastSubrange(yAxisFilter)?.subranges ?? filters[yAxisFilter],
    rowLabel
  );

  const updateCarouselState = (result: ReturnType<typeof drillDownTypeAxis>) =>
    useCarouselStore.setState({
      columnOffset: 0,
      rowOffset: 0,
      columnRanges: result.xRanges,
      rowRanges: result.yRanges,
      dataPerCell: result.carousel,
      carouselData: result.accommodations,
    });

  const addCellDrillStepWithTypeAxis = (
    typeAxis: Axis,
    accommodations: Accommodation[]
  ) => {
    const filter = typeAxis === Axis.X ? yAxisFilter : xAxisFilter;

    addStep({
      xAxisFilter,
      yAxisFilter,
      label: generateFilterLabel(xAxisFilter, xParent, yAxisFilter, yParent),
      filterState: {
        [FilterOption.Distance]:
          filter === FilterOption.Distance
            ? yParent
            : lastStep?.filterState[FilterOption.Distance] ?? null,
        [FilterOption.Price]:
          filter === FilterOption.Price
            ? yParent
            : lastStep?.filterState[FilterOption.Price] ?? null,
        [FilterOption.Rating]:
          filter === FilterOption.Rating
            ? yParent
            : lastStep?.filterState[FilterOption.Rating] ?? null,
        [FilterOption.Type]: xParent,
      },
      carouselDataSnapshot: accommodations,
    });
  };

  const getUpdatedFilterStateForCellDrill = (
    lastStep: DrillStep | null,
    xAxisFilter: FilterOption,
    yAxisFilter: FilterOption,
    xParent: Subrange | null,
    yParent: Subrange | null
  ) => ({
    [FilterOption.Distance]:
      xAxisFilter === FilterOption.Distance
        ? xParent
        : yAxisFilter === FilterOption.Distance
        ? yParent
        : lastStep?.filterState[FilterOption.Distance] ?? null,
    [FilterOption.Price]:
      xAxisFilter === FilterOption.Price
        ? xParent
        : yAxisFilter === FilterOption.Price
        ? yParent
        : lastStep?.filterState[FilterOption.Price] ?? null,
    [FilterOption.Rating]:
      xAxisFilter === FilterOption.Rating
        ? xParent
        : yAxisFilter === FilterOption.Rating
        ? yParent
        : lastStep?.filterState[FilterOption.Rating] ?? null,
    [FilterOption.Type]: lastStep?.filterState[FilterOption.Type] ?? null,
  });

  // X Type
  if (xAxisFilter === FilterOption.Type && yParent?.subranges) {
    const result = drillDownTypeAxis({
      type: colLabel,
      axis: Axis.X,
      otherFilter: yAxisFilter,
      otherAxisRanges: yParent.subranges,
      data: carouselData,
    });

    setAxisFiltersAndType(result.xAxisFilter, result.yAxisFilter, colLabel);
    updateCarouselState(result);
    addCellDrillStepWithTypeAxis(Axis.X, result.accommodations);
    return;
  }

  // Y Type
  if (yAxisFilter === FilterOption.Type && xParent?.subranges) {
    const result = drillDownTypeAxis({
      type: rowLabel,
      axis: Axis.Y,
      otherFilter: xAxisFilter,
      otherAxisRanges: xParent.subranges,
      data: carouselData,
    });

    setAxisFiltersAndType(result.xAxisFilter, result.yAxisFilter, rowLabel);
    updateCarouselState(result);
    addCellDrillStepWithTypeAxis(Axis.Y, result.accommodations);
    return;
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
    yAxisFilter
  );

  useCarouselStore.setState({
    columnOffset: 0,
    rowOffset: 0,
    columnRanges: xParent.subranges,
    rowRanges: yParent.subranges,
    dataPerCell: carousel,
    carouselData: accommodations,
  });

  return addStep({
    xAxisFilter,
    yAxisFilter,
    label: generateFilterLabel(xAxisFilter, xParent, yAxisFilter, yParent),
    filterState: getUpdatedFilterStateForCellDrill(
      lastStep,
      xAxisFilter,
      yAxisFilter,
      xParent,
      yParent
    ),
    carouselDataSnapshot: accommodations,
  });
};

export const drillDownColumn = (colIndex: number) => {
  drillDownAxis(Axis.X, colIndex);
};

export const drillDownRow = (rowIndex: number) => {
  drillDownAxis(Axis.Y, rowIndex);
};

const drillDownTypeAxis = ({
  type,
  axis,
  otherFilter,
  otherAxisRanges,
  data,
}: {
  type: string;
  axis: Axis;
  otherFilter: FilterOption;
  otherAxisRanges: Subrange[];
  data: Accommodation[];
}) => {
  const filteredData = data.filter((acc) => acc.type === type);
  const fallbackAxis = getFallbackFilter(axis, otherFilter);
  const newRanges =
    useFilterHistoryStore.getState().getLastSubrange(fallbackAxis)?.subranges ??
    filters[fallbackAxis];

  const isXType = axis === Axis.X;
  const xRanges = isXType ? newRanges : otherAxisRanges;
  const yRanges = isXType ? otherAxisRanges : newRanges;
  const xAxisFilter = isXType ? fallbackAxis : otherFilter;
  const yAxisFilter = isXType ? otherFilter : fallbackAxis;

  const { carousel, accommodations } = buildCarouselGrid(
    xRanges,
    yRanges,
    filteredData,
    xAxisFilter,
    yAxisFilter
  );

  return {
    carousel,
    accommodations,
    xAxisFilter,
    yAxisFilter,
    xRanges,
    yRanges,
  };
};
