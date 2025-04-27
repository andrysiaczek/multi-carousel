import { ChevronLeft } from 'lucide-react';
import { ResultItem, ResultsHeader } from '../components';
import { useSortStore, useStudyStore } from '../store';
import { InterfaceOption, SortOption } from '../types';

interface ResultsPageProps {
  interfaceOption: InterfaceOption;
}

export const ResultsPage = ({ interfaceOption }: ResultsPageProps) => {
  const {
    sortField,
    sortAscending,
    accommodations,
    setSortField,
    setSortDirection,
  } = useSortStore();
  const { closeResultsModal } = useStudyStore();

  const handleSortChange = (field: SortOption) => setSortField(field);
  const handleSortDirection = (ascending: boolean) =>
    setSortDirection(ascending);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 flex flex-col items-center">
      {/* Back Button */}
      <button
        type="button"
        aria-label="Go back to filtering page"
        onClick={closeResultsModal}
        className="flex items-center text-darkOrange text-m font-normal hover:font-medium self-start mb-4 ml-4 transition-transform duration-300 hover:-translate-x-1"
      >
        <ChevronLeft
          size={16}
          className="inline-block mr-1 hover:font-semibold"
        />
        Back To Filtering
      </button>

      {/* Results List */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Results Header */}
        <ResultsHeader
          count={accommodations.length}
          sortField={sortField}
          sortAscending={sortAscending}
          onSortChange={handleSortChange}
          setSortDirection={handleSortDirection}
        />

        {accommodations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 bg-white text-gray-600 rounded-lg shadow-md">
            <p className="text-lg font-semibold">No Results Found</p>
            <p className="text-sm text-gray-500">
              Sorry, we couldn’t find any properties matching your criteria.
            </p>
            <p className="text-xs text-gray-400">Try adjusting your filters.</p>
          </div>
        ) : (
          accommodations.map((accommodation) => (
            <ResultItem
              key={accommodation.id}
              accommodation={accommodation}
              interfaceOption={interfaceOption}
            />
          ))
        )}
      </div>
    </div>
  );
};
