import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { typeCategories } from '../../data';
import { decisionChips } from '../../types';

interface FilterSidebarProps {
  priceRange: [number, number];
  ratingRange: [number, number];
  distanceRange: [number, number];
  selectedTypes: string[];
  selectedFeatures: string[];

  onPriceChange: (r: [number, number]) => void;
  onRatingChange: (r: [number, number]) => void;
  onDistanceChange: (r: [number, number]) => void;
  onToggleType: (t: string) => void;
  onToggleFeature: (f: string) => void;
  onResetAll: () => void;
}

export const FilterSidebar = ({
  priceRange,
  ratingRange,
  distanceRange,
  selectedTypes,
  selectedFeatures,
  onPriceChange,
  onRatingChange,
  onDistanceChange,
  onToggleType,
  onToggleFeature,
  onResetAll,
}: FilterSidebarProps) => {
  const [minP, maxP] = priceRange;
  const [minR, maxR] = ratingRange;
  const [minD, maxD] = distanceRange;

  const canReset =
    minP !== 15 ||
    maxP !== 600 ||
    minR !== 1 ||
    maxR !== 5 ||
    minD !== 0 ||
    maxD !== 10 ||
    selectedTypes.length > 0 ||
    selectedFeatures.length > 0;

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
            value={[minP, maxP]}
            onChange={(value) => {
              if (Array.isArray(value)) {
                onPriceChange(value as [number, number]);
              }
            }}
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
            <span>€{minP}</span>
            <span>€{maxP}</span>
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
            value={[minR, maxR]}
            onChange={(value) => {
              if (Array.isArray(value)) {
                onRatingChange(value as [number, number]);
              }
            }}
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
            <span>{minR}★</span>
            <span>{maxR}★</span>
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
            value={[minD, maxD]}
            onChange={(value) => {
              if (Array.isArray(value)) {
                onDistanceChange(value as [number, number]);
              }
            }}
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
            <span>{minD} km</span>
            <span>{maxD} km</span>
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
                checked={selectedTypes.includes(type.label)}
                onChange={() => onToggleType(type.label)}
              />
              <span className="text-sm">{type.label}</span>
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
              onClick={() => onToggleFeature(chip)}
              aria-label={chip}
              className={`px-2 py-1 rounded-full border text-xs transition ${
                selectedFeatures.includes(chip)
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
          onClick={onResetAll}
          disabled={!canReset}
          aria-label="Reset All Filters"
          className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition ${
            canReset
              ? 'bg-gray-600 text-white hover:bg-darkGreen'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};
