import { useDecisionChipsStore } from '../store/useDecisionChipsStore';

const decisionChips = [
  'Shared kitchen',
  'Free Wi-Fi',
  'Common room',
  'Lockers',
  'Shared bathroom',
  '24h reception',
  'Hostel entertainment',
  'Luggage storage',
  'Private room',
  'Private bathroom',
  'Air conditioning',
  'TV in room',
  'Breakfast available',
  'Daily housekeeping',
  'Breakfast included',
  'Garden',
  'Terrace',
  'Family-friendly',
  'Non-smoking rooms',
  'Tea/coffee maker',
  'Restaurant',
  'Bar',
  'Room service',
  'Fitness center',
  'Rooftop terrace',
  'Pool',
  'Gym',
  'Spa',
  'Concierge',
  'Valet parking',
  'Luxury rooms',
  'Sea view',
  'Private beach',
  'Airport shuttle',
  'Entire place',
  'Kitchen',
  'Washer',
  'Balcony',
  'Coffee machine',
  'Self check-in',
  'Parking',
  'Pet-friendly',
];

export const DecisionChipsPanel = () => {
  const { selectedChips, toggleChip, resetChips } = useDecisionChipsStore();

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold">Additional Filters:</h3>

      <div className="flex flex-wrap gap-2">
        {decisionChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => toggleChip(chip)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedChips.includes(chip)
                ? 'bg-darkGreen text-white border-darkGreen'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {selectedChips.length > 0 && (
        <button
          type="button"
          onClick={resetChips}
          className="mt-3 text-sm text-red-500 underline"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
