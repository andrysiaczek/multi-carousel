import { useCarouselStore } from '../store';

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

export const resetColumnOffset = () =>
  useCarouselStore.setState({ columnOffset: 0 });

export const resetRowOffset = () => useCarouselStore.setState({ rowOffset: 0 });

export const resetPosition = () =>
  useCarouselStore.setState({ columnOffset: 0, rowOffset: 0 });
