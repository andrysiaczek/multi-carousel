import { useAxisFilterStore, useFilterHistoryStore } from '../../store';
import { Axis, FilterOption } from '../../types';
import { capitalize } from '../../utils';

interface FilterAxisSelectorProps {
  axis: Axis;
}

export const FilterAxisSelector = ({ axis }: FilterAxisSelectorProps) => {
  const {
    xAxisFilter,
    yAxisFilter,
    chosenType,
    setXAxisFilter,
    setYAxisFilter,
  } = useAxisFilterStore();
  const getLastSubrange = useFilterHistoryStore.getState().getLastSubrange;

  const isXAxis = axis === Axis.X;
  const otherAxisFilter = isXAxis ? yAxisFilter : xAxisFilter;
  const filterOptionsArray = Object.values(FilterOption);

  const handleClick = (filter: FilterOption) => {
    if (isXAxis) setXAxisFilter(filter);
    else setYAxisFilter(filter);
  };

  return (
    <div className={`flex ${isXAxis ? 'gap-2 pb-2' : 'flex-col gap-3'}`}>
      {filterOptionsArray
        .filter((filter) =>
          // (1) Type only if not yet chosen
          filter === FilterOption.Type
            ? !chosenType
            : // (2) Other axes only if never drilled OR still has subranges
              (() => {
                const last = getLastSubrange(filter);
                return last === null || Boolean(last.subranges?.length);
              })()
        )
        .map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => handleClick(filter)}
            disabled={otherAxisFilter === filter}
            className={`w-yFilterAxisSelector px-4 py-2 rounded-full border text-sm transition ${
              (isXAxis ? xAxisFilter : yAxisFilter) === filter
                ? 'bg-gray-700 text-white border-gray-500 shadow-lg'
                : otherAxisFilter === filter
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {capitalize(filter)}
          </button>
        ))}
    </div>
  );
};
