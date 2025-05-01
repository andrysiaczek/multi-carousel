import { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { typeCategories } from '../../data';
import { EventType } from '../../firebase';
import {
  initialFilterSidebarState,
  useFilterSidebarStore,
  useStudyStore,
} from '../../store';
import { FilterOptionWithFeature } from '../../types';
import { decisionChips } from '../../utils';

export const FilterSidebar = ({
  applyFilters,
}: {
  applyFilters: (resetAllFilters?: boolean) => void;
}) => {
  const {
    filters,
    setNumericalFilter,
    addStringFilter,
    removeStringFilter,
    resetState,
  } = useFilterSidebarStore();
  const { logEvent } = useStudyStore();

  // State for temporary filter values before applying
  const [price, setPrice] = useState<[number, number]>(filters.price);
  const [rating, setRating] = useState<[number, number]>(filters.rating);
  const [distance, setDistance] = useState<[number, number]>(filters.distance);

  useEffect(() => {
    if (filters === initialFilterSidebarState) {
      setPrice(initialFilterSidebarState[FilterOptionWithFeature.Price]);
      setRating(initialFilterSidebarState[FilterOptionWithFeature.Rating]);
      setDistance(initialFilterSidebarState[FilterOptionWithFeature.Distance]);
    }
  }, [filters]);

  const isResetAllDisabled =
    price == initialFilterSidebarState[FilterOptionWithFeature.Price] &&
    rating == initialFilterSidebarState[FilterOptionWithFeature.Rating] &&
    distance == initialFilterSidebarState[FilterOptionWithFeature.Distance] &&
    filters.type.length === 0 &&
    filters.feature.length === 0;

  const handlePriceChange = () => {
    if (price !== filters[FilterOptionWithFeature.Price]) {
      logEvent(EventType.FilterApply, {
        filterType: 'price',
        filterValue: price.toString(),
      });
      setNumericalFilter(FilterOptionWithFeature.Price, price);
      applyFilters();
    }
  };

  const handleRatingChange = () => {
    if (rating !== filters[FilterOptionWithFeature.Rating]) {
      logEvent(EventType.FilterApply, {
        filterType: 'rating',
        filterValue: rating.toString(),
      });
      setNumericalFilter(FilterOptionWithFeature.Rating, rating);
      applyFilters();
    }
  };

  const handleDistanceChange = () => {
    if (distance !== filters[FilterOptionWithFeature.Distance]) {
      logEvent(EventType.FilterApply, {
        filterType: 'distance',
        filterValue: distance.toString(),
      });
      setNumericalFilter(FilterOptionWithFeature.Distance, distance);
      applyFilters();
    }
  };

  const handleToggleFeature = (feature: string) => {
    if (filters.feature.includes(feature)) {
      logEvent(EventType.FilterReset, {
        filterType: 'feature',
        filterValue: feature,
      });
      removeStringFilter(FilterOptionWithFeature.Feature, feature);
    } else {
      logEvent(EventType.FilterApply, {
        filterType: 'feature',
        filterValue: feature,
      });
      addStringFilter(FilterOptionWithFeature.Feature, feature);
    }
    applyFilters();
  };

  const handleToggleType = (type: string) => {
    if (filters.type.includes(type)) {
      logEvent(EventType.FilterReset, {
        filterType: 'type',
        filterValue: type,
      });
      removeStringFilter(FilterOptionWithFeature.Type, type);
    } else {
      logEvent(EventType.FilterApply, {
        filterType: 'type',
        filterValue: type,
      });
      addStringFilter(FilterOptionWithFeature.Type, type);
    }
    applyFilters();
  };

  const handleResetAll = () => {
    logEvent(EventType.FilterResetAll, {
      scope: 'allFilters',
    });
    setPrice(initialFilterSidebarState[FilterOptionWithFeature.Price]);
    setRating(initialFilterSidebarState[FilterOptionWithFeature.Rating]);
    setDistance(initialFilterSidebarState[FilterOptionWithFeature.Distance]);
    resetState();
    applyFilters(true);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-md shadow-md h-full flex flex-col">
      {/* Price Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Price (per night)</h3>
        <div className="px-2">
          <Slider
            range
            min={15}
            max={600}
            value={price}
            onChange={(value) => setPrice(value as [number, number])}
            onChangeComplete={handlePriceChange}
            styles={{
              track: { backgroundColor: '#006D77' },
              rail: { backgroundColor: '#ccc' },
              handle: {
                backgroundColor: '#006D77',
                borderColor: '#006D77',
              },
            }}
            aria-label="Price Range"
            className="w-full"
          />
          <div className="flex justify-between text-gray-600 text-sm">
            <span>€{price[0]}</span>
            <span>€{price[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Rating</h3>
        <div className="px-2">
          <Slider
            range
            min={1}
            max={5}
            step={0.1}
            value={rating}
            onChange={(value) => setRating(value as [number, number])}
            onChangeComplete={handleRatingChange}
            styles={{
              track: { backgroundColor: '#006D77' },
              rail: { backgroundColor: '#ccc' },
              handle: {
                backgroundColor: '#006D77',
                borderColor: '#006D77',
              },
            }}
            aria-label="Rating Range"
            className="w-full"
          />
          <div className="flex justify-between text-gray-600 text-sm">
            <span>{rating[0]}★</span>
            <span>{rating[1]}★</span>
          </div>
        </div>
      </div>

      {/* Distance Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Distance (from center)</h3>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={10}
            step={0.1}
            value={distance}
            onChange={(value) => setDistance(value as [number, number])}
            onChangeComplete={handleDistanceChange}
            styles={{
              track: { backgroundColor: '#006D77' },
              rail: { backgroundColor: '#ccc' },
              handle: {
                backgroundColor: '#006D77',
                borderColor: '#006D77',
              },
            }}
            aria-label="Distance Range"
            className="w-full"
          />
          <div className="flex justify-between text-gray-600 text-sm">
            <span>{distance[0]} km</span>
            <span>{distance[1]} km</span>
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Property Type</h3>
        <div className="flex flex-col gap-2">
          {typeCategories.map((type) => (
            <label
              key={type.label}
              className="flex items-center gap-2 text-gray-700 text-sm"
            >
              <input
                type="checkbox"
                checked={filters.type.includes(type.label)}
                onChange={() => handleToggleType(type.label)}
                aria-label={type.label}
                className="form-checkbox"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* Feature Chips */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Features</h3>
        <div className="flex flex-wrap gap-2">
          {decisionChips.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => handleToggleFeature(chip)}
              aria-label={chip}
              className={`px-2 py-1 rounded-full border text-xs transition ${
                filters.feature.includes(chip)
                  ? 'bg-darkGreen text-white border-darkGreen'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Reset All Button */}
      <div className="mt-auto mb-2">
        <button
          type="button"
          onClick={handleResetAll}
          disabled={isResetAllDisabled}
          aria-label="Reset All Filters"
          className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition ${
            isResetAllDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-darkGreen'
          }`}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};
