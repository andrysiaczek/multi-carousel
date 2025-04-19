import { RotateCcw } from 'lucide-react';
import { useDecisionChipsStore } from '../store';

export const DecisionChipsPanel = () => {
  const { availableChips, selectedChips, toggleChip, resetChips } =
    useDecisionChipsStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4 border-b">
      {availableChips.map((chip) => {
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
            {chip}
          </button>
        );
      })}

      {selectedChips.length > 0 && (
        <button
          type="button"
          onClick={resetChips}
          className={`flex items-center justify-center px-3 py-1 text-gray-700 text-xs cursor-pointer hover:bg-darkGreen hover:text-white transition rounded-full`}
          aria-label="Reset filters"
          title="Reset filters"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};
