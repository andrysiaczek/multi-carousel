import { FilterSidebar, ResultItem, ResultsHeader } from '../components';
import { accommodationDataset } from '../data';
import { useFilterSidebarStore, useSortStore } from '../store';
import { FilterOptionWithFeature, InterfaceOption, SortOption } from '../types';

export const BenchmarkPage = () => {
  const { filters } = useFilterSidebarStore();
  const {
    sortField,
    sortAscending,
    accommodations,
    setSortField,
    setSortDirection,
    setAccommodations,
  } = useSortStore();

  const handleSortChange = (field: SortOption) => setSortField(field);
  const handleSortDirection = (ascending: boolean) =>
    setSortDirection(ascending);

  // Filter the accommodations based on the selected filters
  const applyFilters = (resetAll = false) => {
    if (resetAll) return setAccommodations(accommodationDataset);

    const filtered = accommodationDataset.filter((acc) => {
      // Check each filter condition
      for (const [key, value] of Object.entries(filters)) {
        switch (key) {
          case FilterOptionWithFeature.Price:
            if (Array.isArray(value)) {
              const [minPrice, maxPrice] = value as [number, number];
              if (acc.price < minPrice || acc.price > maxPrice) return false;
            }
            break;

          case FilterOptionWithFeature.Distance:
            if (Array.isArray(value)) {
              const [minDistance, maxDistance] = value as [number, number];
              if (acc.distance < minDistance || acc.distance > maxDistance)
                return false;
            }
            break;

          case FilterOptionWithFeature.Rating:
            if (Array.isArray(value)) {
              const [minRating, maxRating] = value as [number, number];
              if (acc.rating < minRating || acc.rating > maxRating)
                return false;
            }
            break;

          case FilterOptionWithFeature.Type:
            if (Array.isArray(value)) {
              const selectedTypes = value as string[];
              // Check if accommodation type is in the selected types
              if (
                !(
                  selectedTypes.length === 0 || selectedTypes.includes(acc.type)
                )
              ) {
                return false;
              }
            }
            break;

          case FilterOptionWithFeature.Feature:
            if (Array.isArray(value)) {
              const selectedFeatures = value as string[];
              // Check if all selected features are present in accommodation features
              if (
                !selectedFeatures.every((feature) =>
                  acc.features.includes(feature)
                )
              ) {
                return false;
              }
            }
            break;

          default:
            break;
        }
      }
      return true;
    });

    setAccommodations(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Filter Sidebar */}
      <div className="w-1/4 px-6 flex-shrink-0 h-screen sticky top-0 overflow-y-auto scrollbar-left py-6">
        <div className="sticky">
          {/* Adjusted height */}
          <FilterSidebar applyFilters={applyFilters} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center max-w-3xl py-6">
        {/* Results Header */}
        <ResultsHeader
          count={accommodations.length}
          sortField={sortField}
          sortAscending={sortAscending}
          onSortChange={handleSortChange}
          setSortDirection={handleSortDirection}
        />

        {/* Results List */}
        <div className="w-full space-y-4">
          {accommodations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 bg-white text-gray-600 rounded-lg shadow-md">
              <p className="text-lg font-semibold">No Results Found</p>
              <p className="text-sm text-gray-500">
                Sorry, we couldn’t find any properties matching your criteria.
              </p>
              <p className="text-xs text-gray-400">
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            accommodations.map((accommodation) => (
              <ResultItem
                key={accommodation.id}
                accommodation={accommodation}
                padding
                interfaceOption={InterfaceOption.Benchmark}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
