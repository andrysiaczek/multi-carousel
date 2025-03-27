import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  inHoverState: boolean;
}

export const ResetButton = ({ onClick, inHoverState }: ResetButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center px-3 py-1 text-gray-700 text-xs cursor-pointer hover:bg-red-500 hover:text-white transition rounded-l-lg ${
      inHoverState ? 'bg-lightOrange text-darkOrange' : 'bg-gray-300'
    }`}
    aria-label="Reset filters"
    title="Reset filters"
  >
    <RotateCcw size={14} />
  </button>
);
