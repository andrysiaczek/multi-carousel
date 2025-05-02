import { useEffect, useRef, useState } from 'react';
import { FilterSidebar, ResultItem, ResultsHeader } from '../components';
import { accommodationDataset } from '../data';
import { useSortStore } from '../store';
import { InterfaceOption } from '../types';

export const BenchmarkPage = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [justReset, setJustReset] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([15, 600]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 10]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const {
    sortField,
    sortAscending,
    accommodations,
    setSortField,
    setSortDirection,
    setAccommodations,
  } = useSortStore();

  useEffect(() => {
    const filtered = accommodationDataset.filter((acc) => {
      const [minP, maxP] = priceRange;
      if (acc.price < minP || acc.price > maxP) return false;

      const [minR, maxR] = ratingRange;
      if (acc.rating < minR || acc.rating > maxR) return false;

      const [minD, maxD] = distanceRange;
      if (acc.distance < minD || acc.distance > maxD) return false;

      if (selectedTypes.length > 0 && !selectedTypes.includes(acc.type))
        return false;

      if (
        selectedFeatures.length > 0 &&
        !selectedFeatures.every((f: string) => acc.features.includes(f))
      ) {
        return false;
      }

      return true;
    });

    setAccommodations(filtered);
  }, [
    priceRange,
    ratingRange,
    distanceRange,
    selectedTypes,
    selectedFeatures,
    setAccommodations,
  ]);

  useEffect(() => {
    if (justReset && sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setJustReset(false);
    }
  }, [justReset]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className="w-1/4 px-6 flex-shrink-0 h-screen sticky top-0 overflow-y-auto scrollbar-left py-6"
      >
        <div className="sticky top-0">
          {/* Adjusted height */}
          <FilterSidebar
            // current values:
            priceRange={priceRange}
            ratingRange={ratingRange}
            distanceRange={distanceRange}
            selectedTypes={selectedTypes}
            selectedFeatures={selectedFeatures}
            // setters:
            onPriceChange={setPriceRange}
            onRatingChange={setRatingRange}
            onDistanceChange={setDistanceRange}
            onToggleType={(t) =>
              setSelectedTypes((ts) =>
                ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]
              )
            }
            onToggleFeature={(f) =>
              setSelectedFeatures((fs) =>
                fs.includes(f) ? fs.filter((x) => x !== f) : [...fs, f]
              )
            }
            onResetAll={() => {
              // reset all filter state
              setPriceRange([15, 600]);
              setRatingRange([1, 5]);
              setDistanceRange([0, 10]);
              setSelectedTypes([]);
              setSelectedFeatures([]);
              // then trigger the scroll effect
              setJustReset(true);
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center max-w-3xl py-6">
        {/* Results Header */}
        <ResultsHeader
          count={accommodations.length}
          sortField={sortField}
          sortAscending={sortAscending}
          onSortChange={setSortField}
          setSortDirection={setSortDirection}
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
