import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Accommodation, InterfaceOption } from '../../types';
import {
  generateDetailPageUrl,
  getFeatureIcon,
  resolveAccommodationVariant,
} from '../../utils';

const shuffleArray = (array: string[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

interface ResultItemProps {
  accommodation: Accommodation;
  interfaceOption: InterfaceOption;
  padding?: boolean;
}

export const ResultItem = ({
  accommodation,
  interfaceOption,
  padding = false,
}: ResultItemProps) => {
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { name, images } = resolveAccommodationVariant(
    interfaceOption,
    accommodation
  );

  // Shuffle images and features only once when the accommodation changes
  const shuffledImages = useMemo(() => shuffleArray(images), [images]);

  const shuffledFeatures = useMemo(
    () => shuffleArray(accommodation.features),
    [accommodation.features]
  );

  const handleDotClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const renderImageDots = () =>
    shuffledImages.map((imagePath, index) => (
      <div
        key={imagePath}
        onClick={() => handleDotClick(index)}
        aria-label={`Image ${index + 1}`}
        className={`w-2 h-2 rounded-full cursor-pointer transition-transform duration-300 ${
          index === activeImageIndex
            ? 'bg-darkGreen scale-125 shadow-lg'
            : 'bg-gray-300 hover:bg-gray-400 scale-100'
        }`}
      ></div>
    ));

  return (
    <div
      className={`flex items-strech bg-white rounded-xl shadow-lg mb-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl max-w-2xl mx-auto ${
        padding ? 'p-4 max-w-3xl' : ''
      }`}
    >
      {/* Image Carousel */}
      <div className="relative w-[250px] h-[200px] flex-shrink-0 overflow-hidden rounded-l-xl">
        <img
          src={shuffledImages[activeImageIndex]}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {renderImageDots()}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-around pl-6 pr-4 my-2 w-full">
        {/* Title and Price */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-darkGreen">{name}</h2>
          <p className="text-xl font-semibold text-darkGreen">
            €{accommodation.price}
          </p>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium px-4">
          <span className="flex items-center">
            {accommodation.rating.toFixed(1)} ★
          </span>
          <div className="h-4 w-[1px] bg-gray-400 mx-4" />
          <span className="flex items-center">
            {accommodation.distance < 0.1
              ? 'Central location'
              : accommodation.distance < 1
              ? `${accommodation.distance * 1000} m`
              : `${accommodation.distance} km`}
          </span>
        </div>

        {/* Show More Button and Features */}
        <div className="flex items-end justify-between">
          {/* Features */}
          <div className="flex flex-col gap-1.5 text-gray-500 text-sm mb-4">
            {shuffledFeatures.slice(0, 3).map((feature) => {
              const Icon = getFeatureIcon(feature);

              return (
                <div
                  key={feature}
                  aria-label={feature}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Icon size={16} className="text-darkGreen" />
                  <span className="text-sm">{feature}</span>
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          <button
            type="button"
            aria-label="Show more"
            className="flex items-center justify-center pl-4 pr-1 py-1.5 text-xs font-semibold text-antiflashWhite bg-darkGreen rounded-md transition-transform duration-300 hover:scale-105 active:scale-95 hover:shadow-md group hover:pr-3 hover:gap-1"
            onClick={() =>
              navigate(generateDetailPageUrl(interfaceOption, accommodation.id))
            }
          >
            Show More
            <ChevronRight
              size={16}
              className="opacity-0 transform translate-x-[-5px] transition-transform duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
