import { ChevronRight } from 'lucide-react';
import { useStudyStore } from '../../store';
import { Accommodation, InterfaceOption } from '../../types';
import { getFeatureIcon } from '../../utils';

interface CarouselItemProps {
  accommodation: Accommodation;
}

export const CarouselItem = ({ accommodation }: CarouselItemProps) => {
  const { openDetailModal } = useStudyStore();

  return (
    <div className="w-64 bg-white rounded-md overflow-hidden relative transition duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Show More Button */}
      <button
        type="button"
        aria-label={`View details about ${accommodation.versionSingleAxisCarousel.name}`}
        className="absolute top-3 right-2 z-10 flex items-center justify-center pl-4 pr-1 py-1.5 text-xs font-semibold text-antiflashWhite bg-darkGreen/60 rounded-md transition-transform duration-300 hover:scale-105 active:scale-95 hover:shadow-lg group hover:pr-3 hover:gap-1 hover:bg-darkGreen"
        onClick={() =>
          openDetailModal(InterfaceOption.SingleAxisCarousel, accommodation.id)
        }
      >
        Show More
        <ChevronRight
          size={16}
          className="opacity-0 transform translate-x-[-5px] transition-transform duration-300 group-hover:opacity-100 group-hover:translate-x-0"
        />
      </button>
      <img
        src={accommodation.versionSingleAxisCarousel.images[0]}
        alt={accommodation.versionSingleAxisCarousel.name}
        className="w-full h-32 object-cover"
      />
      <div className="px-1 py-2">
        {/* Info Section */}
        <div className="flex flex-col justify-around gap-2 px-4 w-full">
          {/* Title and Price */}
          <div className="flex items-center justify-between font-semibold text-darkGreen">
            <h2
              className="truncate"
              title={accommodation.versionSingleAxisCarousel.name}
            >
              {accommodation.versionSingleAxisCarousel.name}
            </h2>
            <p>€{accommodation.price}</p>
          </div>

          {/* Rating and Distance */}
          <div className="flex items-center justify-center gap-4 text-gray-600 w-full text-xs font-medium">
            <span className="flex items-center">
              {accommodation.rating.toFixed(1)} ★
            </span>
            <div className="h-4 w-[1px] bg-gray-400 mx-4" />
            <span className="flex items-center">
              {accommodation.distance < 0.1
                ? 'Central'
                : accommodation.distance < 1
                ? `${accommodation.distance * 1000} m`
                : `${accommodation.distance} km`}
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5 text-gray-500 text-sm">
            {accommodation.features
              .filter((feature) => feature.length < 15)
              .slice(0, 4)
              .map((feature) => {
                const Icon = getFeatureIcon(feature);

                return (
                  <div
                    key={feature}
                    aria-label={feature}
                    className="flex items-center gap-0.5"
                  >
                    <Icon size={12} />
                    <span className="text-xs">{feature}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
