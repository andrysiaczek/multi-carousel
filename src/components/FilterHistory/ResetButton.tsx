import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  isHighlighted: boolean;
  isPreviewing: boolean;
}

export const ResetButton = ({
  onClick,
  isHighlighted,
  isPreviewing,
}: ResetButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center px-3 py-1 text-gray-700 text-xs cursor-pointer hover:bg-darkOrange hover:text-white transition rounded-l-lg ${
      isHighlighted
        ? 'bg-lightOrange text-darkOrange'
        : isPreviewing
        ? 'bg-gray-200'
        : 'bg-gray-300'
    } `}
    aria-label="Reset filters"
    title="Reset filters"
  >
    <RotateCcw
      size={14}
      className={`${isHighlighted ? 'text-darkOrange hover:text-white' : ''}`}
    />
  </button>
);
