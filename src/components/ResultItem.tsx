import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Accommodation } from '../types';

const shuffleArray = (array: string[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

interface ResultItemProps {
  accommodation: Accommodation;
}

export const ResultItem = ({ accommodation }: ResultItemProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [shuffledFeatures, setShuffledFeatures] = useState<string[]>([]);
  const navigate = useNavigate();

  // Shuffle images and features on mount
  useEffect(() => {
    setShuffledImages(shuffleArray(accommodation.images));
    setShuffledFeatures(shuffleArray(accommodation.features));
  }, [accommodation.images, accommodation.features]);

  const handleDotClick = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="flex items-strech bg-white rounded-xl shadow-lg mb-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl max-w-2xl mx-auto">
      {/* Image Carousel */}
      <div className="relative w-[250px] h-[200px] flex-shrink-0 overflow-hidden rounded-l-xl">
        <img
          src={shuffledImages[activeImageIndex]}
          alt={accommodation.nameI}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {shuffledImages.map((imagePath, index) => (
            <div
              key={imagePath}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-transform duration-300 ${
                index === activeImageIndex
                  ? 'bg-darkGreen scale-125 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 scale-100'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Accommodation Info */}
      <div className="flex-1 p-4">
        <h3 className="text-xl font-semibold text-darkGreen">
          {accommodation.nameI}
        </h3>
        <p className="text-gray-600 text-sm">{accommodation.rating} ★</p>
        <div className="mt-2 text-gray-700 text-xs space-y-1">
          {shuffledFeatures.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center gap-1">
              <ChevronRight size={12} />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Price and Show More */}
      <div className="flex flex-col justify-between text-right p-4">
        <p className="text-xl font-semibold text-darkGreen">
          €{accommodation.price}
        </p>
        <button
          type="button"
          className="flex items-center pl-4 pr-1 py-1.5 text-xs font-semibold text-antiflashWhite bg-darkGreen rounded-md transition group hover:pr-3 hover:gap-1"
          onClick={() => {
            navigate(`/details/${accommodation.id}`);
          }}
        >
          Show More
          <ChevronRight
            size={16}
            className="opacity-0 transform translate-x-[-5px] transition-transform duration-300 group-hover:opacity-100 group-hover:translate-x-0"
          />
        </button>
      </div>
    </div>
  );
};
