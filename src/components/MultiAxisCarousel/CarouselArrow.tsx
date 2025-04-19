import React from 'react';

interface CarouselArrowProps {
  position: string; // relative positioning, e.g. "left-0 top-1/2 -translate-y-1/2"
  onClick: () => void;
  icon: React.ReactNode;
}

export const CarouselArrow = ({
  position,
  onClick,
  icon,
}: CarouselArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute ${position} 
      bg-lightOrange/70 backdrop-blur-md 
      hover:bg-lightOrange text-darkOrange 
      border border-lightOrange hover:border-lightOrange
      shadow-md 
      opacity-80 hover:opacity-100 
      rounded-full p-1
      transition-transform duration-200 ease-in-out 
      hover:scale-110`}
  >
    {icon}
  </button>
);
