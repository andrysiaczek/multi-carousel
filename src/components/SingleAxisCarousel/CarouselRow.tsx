import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { CarouselItem } from '../../components';
import { accommodationDataset, filters } from '../../data';
import { useDecisionChipsStore, useSingleAxisCarouselStore } from '../../store';
import { FilterOption } from '../../types';
import {
  capitalize,
  filterAccommodationsSingleAxisCarousel,
} from '../../utils';

interface CarouselRowProps {
  filterOption: FilterOption;
}

export const CarouselRow = ({ filterOption }: CarouselRowProps) => {
  const { titles, scrolls, setTitleIndex, setScrollPosition } =
    useSingleAxisCarouselStore();
  const { selectedChips } = useDecisionChipsStore();
  const navigate = useNavigate();

  const titleIndex = titles[filterOption];
  const scrollPosition = scrolls[filterOption];

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5); // fallback default
  const [showListOffset, setShowListOffset] = useState(36); // 32px the right arrow + 4px from the additional margin

  // Item + margin width
  const itemTotalWidth = 256 + 8; // 256px + 8px gap

  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 64 + 8; // 32px each arrow & 8px additional margin
        const count = Math.floor(containerWidth / itemTotalWidth);
        const visibleCount = count > 0 ? count : 1;
        setVisibleCount(visibleCount);
        setShowListOffset(
          (containerRef.current.offsetWidth -
            visibleCount * itemTotalWidth +
            8 -
            64) /
            2 +
            32
        ); // calculated additional space left on one side + 32px from the arrow width
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Load the range data for the current filter option
  const filterRanges = useMemo(() => {
    return filters[filterOption] || [];
  }, [filterOption]);
  const accommodations = useMemo(() => {
    return filterAccommodationsSingleAxisCarousel(
      accommodationDataset,
      filterOption,
      filterRanges[titleIndex]?.label,
      selectedChips
    );
  }, [filterOption, titleIndex, selectedChips, filterRanges]);

  // Scroll Handlers for Carousel
  const scrollLeft = () =>
    setScrollPosition(filterOption, Math.max(scrollPosition - 1, 0));
  const scrollRight = () =>
    setScrollPosition(
      filterOption,
      Math.min(
        scrollPosition + 1,
        Math.max(0, accommodations.length - visibleCount)
      )
    );

  // Scroll Handlers for Vertical Title
  const scrollTitleUp = () =>
    setTitleIndex(filterOption, Math.max(titleIndex - 1, 0));
  const scrollTitleDown = () =>
    setTitleIndex(
      filterOption,
      Math.min(titleIndex + 1, filterRanges.length - 1)
    );

  const handleShowList = () => {
    // Set the filtered accommodations and navigate to results
    localStorage.setItem(
      'filteredAccommodations',
      JSON.stringify(accommodations)
    );
    navigate('/results');
  };

  return (
    <div className="w-full py-4 relative bg-gray-100">
      {/* Vertically Scrollable Title with Minimalistic Arrows */}
      <div className="flex flex-col items-center gap-1 mb-2">
        <button
          type="button"
          aria-label="Scroll title up"
          onClick={scrollTitleUp}
          className={`p-1 rounded-full text-gray-500 hover:bg-gray-100 ${
            titleIndex === 0 ? 'text-gray-300 cursor-not-allowed' : ''
          }`}
          disabled={titleIndex === 0}
        >
          <ChevronUp size={16} />
        </button>
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-xl flex items-center gap-2">
            <span className="font-semibold text-darkGreen w-60 text-end">
              {capitalize(filterOption)}
            </span>
            <span className="w-[1px] h-5 bg-gray-500 mx-2" />
            {/* Vertical Divider */}
            <span className="font-semibold text-darkGreen w-60 text-start">
              {filterRanges[titleIndex]?.label}
            </span>
          </h2>
          <span className="text-sm font-medium text-gray-500 mt-1">
            {filterRanges[titleIndex]?.sublabel || ''}
          </span>
        </div>
        <button
          type="button"
          aria-label="Scroll title down"
          onClick={scrollTitleDown}
          className={`p-1 rounded-full text-gray-500 hover:bg-gray-100 ${
            titleIndex === filterRanges.length - 1
              ? 'text-gray-300 cursor-not-allowed'
              : ''
          }`}
          disabled={titleIndex === filterRanges.length - 1}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Carousel with Left and Right Arrows */}
      <div className="relative" ref={containerRef}>
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Scroll carousel left"
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition z-10 ${
            scrollPosition === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Carousel Items */}
        <div className="flex overflow-visible scrollbar-hide space-x-2 py-2 justify-center relative">
          {accommodations
            .slice(scrollPosition, scrollPosition + visibleCount)
            .map((item) => (
              <CarouselItem key={item.id} accommodation={item} />
            ))}
          {/* Show List Button */}
          <button
            type="button"
            aria-label="Show all accommodations in this list"
            className="flex items-center absolute -top-6 text-sm font-medium text-darkGreen hover:underline hover:font-semibold transition-all duration-300 group"
            style={{
              right: `${showListOffset}px`,
            }}
            onClick={handleShowList}
          >
            Show this list
            <ChevronRight
              size={12}
              className="ml-1 text-darkGreen transform transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-90 group-hover:stroke-[2.5]"
            />
          </button>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Scroll carousel right"
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition ${
            scrollPosition + visibleCount >= accommodations.length
              ? 'opacity-0 pointer-events-none'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
