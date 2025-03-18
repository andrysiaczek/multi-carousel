import { useAxisFilterStore } from '../store/useAxisFilterStore';

const availableFilters = ['Price', 'Reviews', 'Distance', 'Type'];

export const FilterAxisSelector = ({ axis }: { axis: 'X' | 'Y' }) => {
  const xAxis = useAxisFilterStore((state) => state.xAxis);
  const yAxis = useAxisFilterStore((state) => state.yAxis);
  const chosenType = useAxisFilterStore((state) => state.chosenType);
  const setXAxis = useAxisFilterStore((state) => state.setXAxis);
  const setYAxis = useAxisFilterStore((state) => state.setYAxis);

  const handleClick = (filter: string) => {
    if (axis === 'X') setXAxis(filter);
    else setYAxis(filter);
  };

  const otherAxis = axis === 'X' ? yAxis : xAxis;

  return (
    <div className="flex gap-2 flex-wrap">
      {availableFilters
        .filter((filter) => !(filter === 'Type' && chosenType !== null)) // Exclude Type if already chosen
        .map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => handleClick(filter)}
            disabled={otherAxis === filter}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              (axis === 'X' ? xAxis : yAxis) === filter
                ? 'bg-gray-500 text-white border-gray-500'
                : otherAxis === filter
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
    </div>
  );
};
