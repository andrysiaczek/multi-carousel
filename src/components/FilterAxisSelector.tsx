import { useAxisFilterStore } from '../store';
import { FilterOption } from '../types';
import { capitalize } from '../utils';

export const FilterAxisSelector = ({ axis }: { axis: 'X' | 'Y' }) => {
  const xAxisFilter = useAxisFilterStore((state) => state.xAxisFilter);
  const yAxisFilter = useAxisFilterStore((state) => state.yAxisFilter);
  const chosenType = useAxisFilterStore((state) => state.chosenType);
  const setXAxisFilter = useAxisFilterStore((state) => state.setXAxisFilter);
  const setYAxisFilter = useAxisFilterStore((state) => state.setYAxisFilter);

  const handleClick = (filter: FilterOption) => {
    if (axis === 'X') setXAxisFilter(filter);
    else setYAxisFilter(filter);
  };

  const otherAxisFilter = axis === 'X' ? yAxisFilter : xAxisFilter;
  const filterOptionsArray = Object.values(FilterOption);

  return (
    <div
      className={`flex ${
        axis === 'X'
          ? 'gap-2 flex-wrap justify-cente'
          : 'flex-col gap-3 items-center'
      }`}
    >
      {filterOptionsArray
        .filter(
          // Exclude Type filter option if already chosen
          (filter) => !(filter === FilterOption.Type && chosenType !== null)
        )
        .map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => handleClick(filter)}
            disabled={otherAxisFilter === filter}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              (axis === 'X' ? xAxisFilter : yAxisFilter) === filter
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
