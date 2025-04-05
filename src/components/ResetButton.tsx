interface ResetButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const ResetButton = ({ onClick, disabled }: ResetButtonProps) => {
  return (
    <div className="absolute top-[40px] left-[60px] flex items-center gap-1 group cursor-pointer">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center p-2 rounded-full transition-transform duration-300 
          ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-darkGreen text-white hover:scale-110'
          }`}
        title="Reset Carousel Position"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v1m0 14v1m7-7h1M4 12H3m9-9l.707.707M4.222 4.222L4.93 4.93M4.222 19.778l.707-.707M19.778 19.778l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-600">
        Reset Position
      </span>
    </div>
  );
};
