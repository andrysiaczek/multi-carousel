import { filters } from '../data';
import {
  useAxisFilterStore,
  useCarouselStore,
  useFilterHistoryStore,
  useSortStore,
  useStudyStore,
} from '../store';
import {
  Accommodation,
  Axis,
  DrillStep,
  FilterOption,
  InterfaceOption,
  SortOption,
  Subrange,
} from '../types';
import {
  addStandardAxisDrillStep,
  addTypeAxisDrillStep,
  buildCarouselGrid,
  filterAccommodationsMultiAxisCarousel,
  findSubrangeByLabel,
  generateFilterLabel,
  updateAvailableChips,
} from '../utils';

const drillDownAxis = (axis: Axis, index: number) => {
  const { xAxisFilter, yAxisFilter, setAxisFilters, setAxisFiltersAndType } =
    useAxisFilterStore.getState();
  const { columnRanges, rowRanges, carouselData } = useCarouselStore.getState();
  const { getLastSubrange } = useFilterHistoryStore.getState();

  const isXAxis = axis === Axis.X;
  const prefix = isXAxis ? 'column' : 'row';
  const label = isXAxis ? columnRanges[index].label : rowRanges[index].label;
  const filter = isXAxis ? xAxisFilter : yAxisFilter;
  const otherFilter = isXAxis ? yAxisFilter : xAxisFilter;
  const parentRange = findSubrangeByLabel(
    getLastSubrange(filter)?.subranges ?? filters[filter],
    label
  );

  if (!parentRange) return;

  if (!parentRange.subranges) {
    if (filter === FilterOption.Type) {
      const result = drillDownTypeAxis({
        type: label,
        axis,
        otherFilter,
        otherAxisRanges: isXAxis ? rowRanges : columnRanges,
        data: carouselData,
      });

      if (!result) return;

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
        result.xAxisFilter,
        result.yAxisFilter,
        parentRange,
        result.accommodations
      );

      updateAvailableChips(result.accommodations);

      return;
    } else {
      // 1. filter carouselData by the selected range (price, rating or distance)
      const filteredData = carouselData.filter((acc) => {
        const val = acc[filter] as number;
        const lo = parentRange?.lowerBound ?? Number.NEGATIVE_INFINITY;
        const hi = parentRange?.upperBound ?? Number.POSITIVE_INFINITY;
        return val >= lo && val < hi;
      });

      // 2. get fallback x and y axis and their ranges from getFallbackFilter
      const fallbackFilter = getFallbackFilter(filter, otherFilter);

      if (!fallbackFilter) {
        const { setAccommodations, setSortField } = useSortStore.getState();

        useCarouselStore.getState().resetHover();
        useFilterHistoryStore.getState().resetHoveredStep();

        setAccommodations(filteredData);

        if (
          Object.values(SortOption).includes(
            xAxisFilter as unknown as SortOption
          )
        ) {
          setSortField(xAxisFilter as unknown as SortOption);
        }

        useStudyStore
          .getState()
          .openResultsModal(InterfaceOption.MultiAxisCarousel);

        return null;
      }

      const fallbackRanges =
        getLastSubrange(fallbackFilter)?.subranges ?? filters[fallbackFilter];

      // 3. buildCarouselGrid with carouselData from 1. and xAxis, yAxis and their ranges from 2.
      const { carousel, accommodations } = buildCarouselGrid(
        isXAxis ? fallbackRanges : columnRanges,
        isXAxis ? rowRanges : fallbackRanges,
        filteredData,
        isXAxis ? fallbackFilter : xAxisFilter,
        isXAxis ? yAxisFilter : fallbackFilter
      );

      setAxisFilters(
        isXAxis ? fallbackFilter : xAxisFilter,
        isXAxis ? yAxisFilter : fallbackFilter
      );

      useCarouselStore.setState({
        [`${prefix}Offset`]: 0,
        [`${prefix}Ranges`]: fallbackRanges,
        dataPerCell: carousel,
        carouselData: accommodations,
      });

      addStandardAxisDrillStep(
        axis,
        xAxisFilter,
        yAxisFilter,
        isXAxis ? fallbackFilter : xAxisFilter,
        isXAxis ? yAxisFilter : fallbackFilter,
        parentRange,
        accommodations
      );

      return updateAvailableChips(accommodations);
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
    xAxisFilter,
    yAxisFilter,
    parentRange,
    accommodations
  );

  updateAvailableChips(accommodations);
};

export const drillDownCell = (colIndex: number, rowIndex: number) => {
  const {
    xAxisFilter,
    yAxisFilter,
    setXAxisFilter,
    setYAxisFilter,
    setAxisFilters,
    setAxisFiltersAndType,
  } = useAxisFilterStore.getState();
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

  const updateCarouselState = (
    result: ReturnType<typeof drillDownTypeAxis>
  ) => {
    if (!result) return;

    useCarouselStore.setState({
      columnOffset: 0,
      rowOffset: 0,
      columnRanges: result.xRanges,
      rowRanges: result.yRanges,
      dataPerCell: result.carousel,
      carouselData: result.accommodations,
    });
  };

  const addCellDrillStepWithTypeAxis = (
    typeAxis: Axis,
    xAxisFilterAfter: FilterOption,
    yAxisFilterAfter: FilterOption,
    accommodations: Accommodation[]
  ) => {
    const filter = typeAxis === Axis.X ? yAxisFilter : xAxisFilter;

    addStep({
      xAxisFilter,
      yAxisFilter,
      xAxisFilterAfter,
      yAxisFilterAfter,
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

    if (!result) return;

    addCellDrillStepWithTypeAxis(
      Axis.X,
      result.xAxisFilter,
      result.yAxisFilter,
      result.accommodations
    );
    setAxisFiltersAndType(result.xAxisFilter, result.yAxisFilter, colLabel);
    updateCarouselState(result);
    updateAvailableChips(result.accommodations);
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

    if (!result) return;

    setAxisFiltersAndType(result.xAxisFilter, result.yAxisFilter, rowLabel);
    updateCarouselState(result);
    addCellDrillStepWithTypeAxis(
      Axis.Y,
      result.xAxisFilter,
      result.yAxisFilter,
      result.accommodations
    );
    updateAvailableChips(result.accommodations);
    return;
  }

  if (!xParent || !yParent) return;

  if (!xParent.subranges || !yParent.subranges) {
    if (!xParent.subranges && !yParent.subranges) {
      const { setAccommodations, setSortField } = useSortStore.getState();

      const filteredData = filterAccommodationsMultiAxisCarousel(
        carouselData,
        xParent,
        yParent,
        xAxisFilter,
        yAxisFilter
      );

      const { xAxis: fallbackXFilter, yAxis: fallbackYFilter } =
        getBothFallbackFilters(xAxisFilter, yAxisFilter);

      if (fallbackXFilter && fallbackYFilter) {
        const fallbackXRanges =
          getLastSubrange(fallbackXFilter)?.subranges ??
          filters[fallbackXFilter];
        const fallbackYRanges =
          getLastSubrange(fallbackYFilter)?.subranges ??
          filters[fallbackYFilter];

        const { carousel, accommodations } = buildCarouselGrid(
          fallbackXRanges,
          fallbackYRanges,
          filteredData,
          fallbackXFilter,
          fallbackYFilter
        );

        const type =
          xAxisFilter === FilterOption.Type
            ? xParent.label
            : yAxisFilter === FilterOption.Type
            ? yParent.label
            : null;

        if (type) {
          setAxisFiltersAndType(fallbackXFilter, fallbackYFilter, type);
        } else {
          setAxisFilters(fallbackXFilter, fallbackYFilter);
        }

        useCarouselStore.setState({
          columnOffset: 0,
          rowOffset: 0,
          columnRanges: fallbackXRanges,
          rowRanges: fallbackYRanges,
          dataPerCell: carousel,
          carouselData: accommodations,
        });

        addStep({
          xAxisFilter,
          yAxisFilter,
          xAxisFilterAfter: fallbackXFilter,
          yAxisFilterAfter: fallbackYFilter,
          label: generateFilterLabel(
            xAxisFilter,
            xParent,
            yAxisFilter,
            yParent
          ),
          filterState: getUpdatedFilterStateForCellDrill(
            lastStep,
            xAxisFilter,
            yAxisFilter,
            xParent,
            yParent
          ),
          carouselDataSnapshot: accommodations,
        });

        return updateAvailableChips(accommodations);
      }

      useCarouselStore.getState().resetHover();
      useFilterHistoryStore.getState().resetHoveredStep();

      setAccommodations(filteredData);

      if (
        Object.values(SortOption).includes(xAxisFilter as unknown as SortOption)
      ) {
        setSortField(xAxisFilter as unknown as SortOption);
      }

      useStudyStore
        .getState()
        .openResultsModal(InterfaceOption.MultiAxisCarousel);

      return console.warn('No subranges on either axis → showing results');
    }

    // Y not drillable
    if (xParent.subranges && !yParent.subranges) {
      // 1. filter carouselData by the selected yParent range (price, rating or distance)
      const filteredData = carouselData.filter((acc) => {
        const val = acc[yAxisFilter] as number;
        const lo = yParent?.lowerBound ?? Number.NEGATIVE_INFINITY;
        const hi = yParent?.upperBound ?? Number.POSITIVE_INFINITY;
        return val >= lo && val < hi;
      });

      // 2. get fallback y axis and its ranges from getFallbackFilter
      const fallbackYFilter = getFallbackFilter(yAxisFilter, xAxisFilter);

      if (!fallbackYFilter) {
        const { setAccommodations, setSortField } = useSortStore.getState();

        useCarouselStore.getState().resetHover();
        useFilterHistoryStore.getState().resetHoveredStep();

        setAccommodations(filteredData);

        if (
          Object.values(SortOption).includes(
            xAxisFilter as unknown as SortOption
          )
        ) {
          setSortField(xAxisFilter as unknown as SortOption);
        }

        useStudyStore
          .getState()
          .openResultsModal(InterfaceOption.MultiAxisCarousel);

        return console.warn('No subranges on Y axis → showing results');
      }

      const fallbackYRanges =
        getLastSubrange(fallbackYFilter)?.subranges ?? filters[fallbackYFilter];

      // 3. buildCarouselGrid with carouselData from 1. and xAxis, yAxis and their ranges from 2.
      const { carousel, accommodations } = buildCarouselGrid(
        xParent.subranges,
        fallbackYRanges,
        filteredData,
        xAxisFilter,
        fallbackYFilter
      );

      setYAxisFilter(fallbackYFilter);

      useCarouselStore.setState({
        columnOffset: 0,
        rowOffset: 0,
        columnRanges: xParent.subranges,
        rowRanges: fallbackYRanges,
        dataPerCell: carousel,
        carouselData: accommodations,
      });

      addStep({
        xAxisFilter,
        yAxisFilter,
        xAxisFilterAfter: xAxisFilter,
        yAxisFilterAfter: fallbackYFilter,
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

      return updateAvailableChips(accommodations);
    }

    // X not drillable
    if (!xParent.subranges && yParent.subranges) {
      // 1. filter carouselData by the selected xParent range (price, rating or distance)
      const filteredData = carouselData.filter((acc) => {
        const val = acc[xAxisFilter] as number;
        const lo = xParent?.lowerBound ?? Number.NEGATIVE_INFINITY;
        const hi = xParent?.upperBound ?? Number.POSITIVE_INFINITY;
        return val >= lo && val < hi;
      });

      // 2. get fallback x axis and its ranges from getFallbackFilter
      const fallbackXFilter = getFallbackFilter(xAxisFilter, yAxisFilter);

      if (!fallbackXFilter) {
        const { setAccommodations, setSortField } = useSortStore.getState();

        useCarouselStore.getState().resetHover();
        useFilterHistoryStore.getState().resetHoveredStep();

        setAccommodations(filteredData);

        if (
          Object.values(SortOption).includes(
            xAxisFilter as unknown as SortOption
          )
        ) {
          setSortField(xAxisFilter as unknown as SortOption);
        }

        useStudyStore
          .getState()
          .openResultsModal(InterfaceOption.MultiAxisCarousel);

        return console.warn('No subranges on X axis → showing results');
      }

      const fallbackXRanges =
        getLastSubrange(fallbackXFilter)?.subranges ?? filters[fallbackXFilter];

      // 3. buildCarouselGrid with carouselData from 1. and xAxis, yAxis and their ranges from 2.
      const { carousel, accommodations } = buildCarouselGrid(
        fallbackXRanges,
        yParent.subranges,
        filteredData,
        fallbackXFilter,
        yAxisFilter
      );

      setXAxisFilter(fallbackXFilter);

      useCarouselStore.setState({
        columnOffset: 0,
        rowOffset: 0,
        columnRanges: fallbackXRanges,
        rowRanges: yParent.subranges,
        dataPerCell: carousel,
        carouselData: accommodations,
      });

      addStep({
        xAxisFilter,
        yAxisFilter,
        xAxisFilterAfter: fallbackXFilter,
        yAxisFilterAfter: yAxisFilter,
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

      return updateAvailableChips(accommodations);
    }
    return;
  }

  // Normal double-subrange drill
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

  addStep({
    xAxisFilter,
    yAxisFilter,
    xAxisFilterAfter: xAxisFilter,
    yAxisFilterAfter: yAxisFilter,
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

  return updateAvailableChips(accommodations);
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
  const fallbackFilter = getFallbackFilter(FilterOption.Type, otherFilter);

  if (!fallbackFilter) {
    const xAxisFilter = useAxisFilterStore.getState();
    const { setAccommodations, setSortField } = useSortStore.getState();

    useCarouselStore.getState().resetHover();
    useFilterHistoryStore.getState().resetHoveredStep();

    setAccommodations(filteredData);

    if (
      Object.values(SortOption).includes(xAxisFilter as unknown as SortOption)
    ) {
      setSortField(xAxisFilter as unknown as SortOption);
    }

    useStudyStore
      .getState()
      .openResultsModal(InterfaceOption.MultiAxisCarousel);

    return null;
  }

  const newRanges =
    useFilterHistoryStore.getState().getLastSubrange(fallbackFilter)
      ?.subranges ?? filters[fallbackFilter];

  const isXType = axis === Axis.X;
  const xRanges = isXType ? newRanges : otherAxisRanges;
  const yRanges = isXType ? otherAxisRanges : newRanges;
  const xAxisFilter = isXType ? fallbackFilter : otherFilter;
  const yAxisFilter = isXType ? otherFilter : fallbackFilter;

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

export const getFallbackFilter = (
  thisFilter: FilterOption,
  otherFilter: FilterOption
): FilterOption | null => {
  const chosenType = useAxisFilterStore.getState();
  const lastStep = useFilterHistoryStore.getState().getLastStep();
  if (!lastStep) return null;

  const state = lastStep.filterState;

  // build a list of all three possible axes, minus the two we just used
  const candidates = (Object.values(FilterOption) as FilterOption[]).filter(
    (f) => f !== thisFilter && f !== otherFilter
  );

  for (const f of candidates) {
    // if it still has subranges, we can drill
    if (
      f !== FilterOption.Type &&
      (state[f] === null || state[f]?.subranges?.length)
    ) {
      return f;
    }
    // special case: if it's the TYPE axis and we haven't used it yet
    if (f === FilterOption.Type && !chosenType) {
      return f;
    }
  }

  return null;
};

export const getBothFallbackFilters = (
  xAxisFilter: FilterOption,
  yAxisFilter: FilterOption
): { xAxis: FilterOption | null; yAxis: FilterOption | null } => {
  const chosenType = useAxisFilterStore.getState();
  const lastStep = useFilterHistoryStore.getState().getLastStep();
  if (!lastStep) return { xAxis: null, yAxis: null };

  const used = new Set([xAxisFilter, yAxisFilter]);
  const state = lastStep.filterState;

  const candidates = (Object.values(FilterOption) as FilterOption[])
    // 1) remove the two that are currently chosen
    .filter((f) => !used.has(f))
    // 2) keep only those you can still drill
    .filter((f) => {
      if (f === FilterOption.Type) {
        // Type only if it hasn’t been chosen yet
        return !chosenType;
      }
      // numeric axes: either never used (null) or still have subranges
      return state[f] == null || Boolean(state[f]?.subranges?.length);
    });

  return {
    xAxis: candidates[0] ?? null,
    yAxis: candidates[1] ?? null,
  };
};
