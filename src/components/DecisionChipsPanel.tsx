import { useDecisionChipsStore } from '../store';

export const DecisionChipsPanel = () => {
  const { availableChips, selectedChips, toggleChip, resetChips } =
    useDecisionChipsStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4 pt-8 border-b">
      {availableChips.map((chip) => (
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
          className="text-sm text-red-500 underline"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
