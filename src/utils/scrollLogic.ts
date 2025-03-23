import { useCarouselStore } from '../store';

export const scrollLeft = () => {
  const state = useCarouselStore.getState();
  const { columnOffset, totalColumns, visibleColumns } = state;

  useCarouselStore.setState({
    columnOffset:
      columnOffset === 0
        ? totalColumns - (visibleColumns - 1)
        : columnOffset - 1,
  });
};

export const scrollRight = () => {
  const state = useCarouselStore.getState();
  const { columnOffset, totalColumns } = state;

  useCarouselStore.setState({
    columnOffset: (columnOffset + 1) % totalColumns,
  });
};

export const scrollUp = () => {
  const state = useCarouselStore.getState();
  const { rowOffset, totalRows, visibleRows } = state;

  useCarouselStore.setState({
    rowOffset: rowOffset === 0 ? totalRows - (visibleRows - 1) : rowOffset - 1,
  });
};

export const scrollDown = () => {
  const state = useCarouselStore.getState();
  const { rowOffset, totalRows } = state;

  useCarouselStore.setState({
    rowOffset: (rowOffset + 1) % totalRows,
  });
};

export const resetPosition = () => {
  useCarouselStore.setState({ columnOffset: 0, rowOffset: 0 });
};
