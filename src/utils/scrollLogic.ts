import { EventType } from '../firebase';
import { useCarouselStore, useStudyStore } from '../store';

export const scrollLeft = () => {
  const { columnOffset, totalColumns, visibleColumns } =
    useCarouselStore.getState();

  useCarouselStore.setState({
    columnOffset:
      columnOffset === 0
        ? totalColumns - (visibleColumns - 1)
        : columnOffset - 1,
  });
};

export const scrollRight = () => {
  const { columnOffset, totalColumns } = useCarouselStore.getState();

  useCarouselStore.setState({
    columnOffset: (columnOffset + 1) % totalColumns,
  });
};

export const scrollUp = () => {
  const { rowOffset, totalRows, visibleRows } = useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: rowOffset === 0 ? totalRows - (visibleRows - 1) : rowOffset - 1,
  });
};

export const scrollDown = () => {
  const { rowOffset, totalRows } = useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: (rowOffset + 1) % totalRows,
  });
};

export const scrollUpLeft = () => {
  const {
    rowOffset,
    totalRows,
    visibleRows,
    columnOffset,
    totalColumns,
    visibleColumns,
  } = useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: rowOffset === 0 ? totalRows - (visibleRows - 1) : rowOffset - 1,
    columnOffset:
      columnOffset === 0
        ? totalColumns - (visibleColumns - 1)
        : columnOffset - 1,
  });
};

export const scrollUpRight = () => {
  const { rowOffset, totalRows, visibleRows, columnOffset, totalColumns } =
    useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: rowOffset === 0 ? totalRows - (visibleRows - 1) : rowOffset - 1,
    columnOffset: (columnOffset + 1) % totalColumns,
  });
};

export const scrollDownLeft = () => {
  const { rowOffset, totalRows, columnOffset, totalColumns, visibleColumns } =
    useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: (rowOffset + 1) % totalRows,
    columnOffset:
      columnOffset === 0
        ? totalColumns - (visibleColumns - 1)
        : columnOffset - 1,
  });
};

export const scrollDownRight = () => {
  const { rowOffset, totalRows, columnOffset, totalColumns } =
    useCarouselStore.getState();

  useCarouselStore.setState({
    rowOffset: (rowOffset + 1) % totalRows,
    columnOffset: (columnOffset + 1) % totalColumns,
  });
};

export const resetColumnOffset = () =>
  useCarouselStore.setState({ columnOffset: 0 });

export const resetRowOffset = () => useCarouselStore.setState({ rowOffset: 0 });

export const resetPosition = () => {
  useStudyStore.getState().logEvent(EventType.Scroll, {
    targetType: 'carousel',
    resetPosition: true,
  });

  useCarouselStore.setState({ columnOffset: 0, rowOffset: 0 });
};
