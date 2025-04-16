import { useDecisionChipsStore } from '../store';
// import { getFeatureIcon } from '../utils';

export const DecisionChipsPanel = () => {
  const { availableChips, selectedChips, toggleChip, resetChips } =
    useDecisionChipsStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4 border-b">
      {availableChips.map((chip) => {
        // const Icon = getFeatureIcon(chip);

        return (
          <button
            key={chip}
            type="button"
            onClick={() => toggleChip(chip)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs transition ${
              selectedChips.includes(chip)
                ? 'bg-darkGreen text-white border-darkGreen'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {/* <Icon
              size={16}
              className={`${
                selectedChips.includes(chip) ? 'text-white' : 'text-gray-500'
              }`}
            /> */}
            {chip}
          </button>
        );
      })}
      {selectedChips.length > 0 && (
        <button
          type="button"
          onClick={resetChips}
          className="text-sm text-gray-500 underline"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
