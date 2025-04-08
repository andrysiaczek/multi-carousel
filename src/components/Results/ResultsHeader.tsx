import { SortOption } from '../../types';
import { capitalize } from '../../utils';

interface ResultsHeaderProps {
  count: number;
  sortField: SortOption;
  sortAscending: boolean;
  onSortChange: (field: SortOption) => void;
  setSortDirection: (ascending: boolean) => void;
}

export const ResultsHeader = ({
  count,
  sortField,
  sortAscending,
  onSortChange,
  setSortDirection,
}: ResultsHeaderProps) => {
  const renderSortButton = (
    ascending: boolean,
    label: string,
    symbol: string
  ) => (
    <button
      type="button"
      onClick={() => setSortDirection(ascending)}
      className={`py-1 px-3 text-sm font-medium transition-colors ${
        sortAscending === ascending
          ? 'bg-darkGreen text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      aria-label={`Sort ${label}`}
      title={`Sort ${label}`}
    >
      {symbol}
    </button>
  );

  return (
    <div className="flex items-center justify-between w-full mb-4 px-2">
      <h2 className="text-l font-semibold text-gray-700">
        {count} properties found
      </h2>
      <div className="flex items-center gap-2">
        {/* Sort Selector */}
        <select
          value={sortField}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort by"
          className="p-1.5 text-sm bg-white border rounded-md text-gray-600 focus:ring-2 focus:ring-darkGreen"
        >
          {Object.values(SortOption).map((option) => (
            <option key={option} value={option}>
              {capitalize(option)}
            </option>
          ))}
        </select>

        {/* Sort Direction Toggle */}
        <div className="flex items-center bg-gray-100 border rounded-md shadow-md overflow-hidden">
          {renderSortButton(true, 'Ascending', '↑')}
          <div className="h-full w-[1px] bg-gray-300" />
          {renderSortButton(false, 'Descending', '↓')}
        </div>
      </div>
    </div>
  );
};
