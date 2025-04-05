import { ChevronLeft, ChevronRight } from 'lucide-react';

// Reusable Button Component
export const ArrowButton = ({
  onClick,
  position,
  isGalleryHovered,
}: {
  onClick: () => void;
  position: 'left' | 'right';
  isGalleryHovered: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute ${position}-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full transition-transform duration-200 ease-in-out hover:scale-110 ${
      isGalleryHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
    }`}
  >
    {position === 'left' ? (
      <ChevronLeft size={24} />
    ) : (
      <ChevronRight size={24} />
    )}
  </button>
);
