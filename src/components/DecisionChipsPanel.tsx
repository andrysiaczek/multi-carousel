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
    <div className="flex flex-wrap justify-center gap-2 p-4 border-b">
      {decisionChips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => toggleChip(chip)}
          className={`px-3 py-1 rounded-full border text-xs transition ${
            selectedChips.includes(chip)
              ? 'bg-darkGreen text-white border-darkGreen'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {chip}
        </button>
      ))}
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
