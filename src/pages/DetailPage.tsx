import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ArrowButton,
  BookingModal,
  LoadingMessage,
  MapLibreMap,
} from '../components';
import { accommodationDataset } from '../data';
import { EventType } from '../firebase';
import { useStudyStore } from '../store';
import { Accommodation, InterfaceOption } from '../types';
import { resolveAccommodationVariant } from '../utils';

interface DetailPageProps {
  interfaceOption: InterfaceOption;
  id: string;
  stepType: 'exploratory' | 'goal' | 'survey';
  onBook: () => Promise<void>;
}

export const DetailPage = ({
  interfaceOption,
  id,
  stepType,
  onBook,
}: DetailPageProps) => {
  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const {
    nextStep,
    closeDetailModal,
    closeResultsModal,
    closeInterface,
    logEvent,
  } = useStudyStore();

  const shuffleArray = (array: string[]): string[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Fetch accommodation data
  useEffect(() => {
    const accommodation = accommodationDataset.find((acc) => acc.id === id);

    if (accommodation) {
      setAccommodation(accommodation);
      const { name, location, images } = resolveAccommodationVariant(
        interfaceOption,
        accommodation
      );
      setName(name);
      setLocation(location);
      setImages(images);

      const features = accommodation.features;
      const hasSwimmingPool = features.includes('Swimming pool');

      let displayedFeatures;

      if (hasSwimmingPool) {
        // Exclude "swimming pool" and take 11 other features
        const otherFeatures = features
          .filter((f) => f !== 'Swimming pool')
          .slice(0, 11);
        // Combine "swimming pool" with the selected features
        displayedFeatures = shuffleArray(['Swimming pool', ...otherFeatures]);
      } else {
        displayedFeatures = features.slice(0, 12);
      }

      setFeatures(displayedFeatures);
    }
  }, [id, interfaceOption]);

  // Image navigation handlers
  const handleNextImage = useCallback(() => {
    if (accommodation) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [accommodation, images]);

  const handlePrevImage = useCallback(() => {
    if (accommodation) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [accommodation, images]);

  const handleDotClick = (index: number) => setActiveImageIndex(index);

  const handleBooking = async () => {
    logEvent(EventType.Click, {
      targetType: 'bookNowButton',
      accommodation: accommodation ?? null,
    });
    logEvent(EventType.TaskEnd, { taskType: stepType });
    await onBook();
    setShowModal(true);
  };

  const handleModalClose = async () => {
    setShowModal(false);
    closeResultsModal();
    closeDetailModal();
    closeInterface();
    nextStep();
  };

  // Auto slide on gallery
  useEffect(() => {
    if (!accommodation) return;
    const interval = setInterval(handleNextImage, 2000);
    return () => clearInterval(interval);
  }, [accommodation, handleNextImage]);

  if (!accommodation)
    return <LoadingMessage message="Loading accommodation details..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-2">
      <div className="flex flex-col w-full max-w-6xl h-[90vh] space-y-4">
        {/* Upper Half: Gallery + Map */}
        <div className="flex w-full h-2/3 space-x-4">
          {/* Gallery */}
          <div
            className="relative w-[60%] h-full rounded-lg overflow-hidden group"
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            <img
              src={images[activeImageIndex]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
            />

            {/* Arrows */}
            <ArrowButton
              onClick={handlePrevImage}
              position="left"
              isGalleryHovered={isGalleryHovered}
            />
            <ArrowButton
              onClick={handleNextImage}
              position="right"
              isGalleryHovered={isGalleryHovered}
            />

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((imagePath, index) => (
                <div
                  key={imagePath}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-transform duration-300 ${
                    index === activeImageIndex
                      ? 'bg-darkGreen scale-125 shadow-lg'
                      : 'bg-gray-400 hover:scale-110 hover:bg-antiflashWhite'
                  }`}
                ></div>
              ))}
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                logEvent(EventType.Click, {
                  targetType: 'detailViewBackButton',
                  accommodation: accommodation,
                });
                closeDetailModal();
              }}
              className="absolute top-4 left-4 flex items-center gap-2 text-antiflashWhite bg-darkGreen/70 pl-3 pr-4 py-2 rounded-full shadow-lg transition-transform duration-300 hover:bg-darkGreen/95 hover:scale-105 active:scale-95"
            >
              <ChevronLeft
                size={20}
                className="inline-block transition-transform duration-300"
              />
              Back
            </button>
          </div>

          {/* Map */}
          <div className="w-[40%] h-full rounded-lg overflow-hidden shadow-md">
            <MapLibreMap
              latitude={location.lat}
              longitude={location.lng}
              zoom={13}
              title={name}
            />
          </div>
        </div>

        {/* Lower Half: Features + Main Info */}
        <div className="flex w-full h-1/3 space-x-4">
          {/* Features (Left Side) */}
          <div className="w-[60%] bg-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out">
            <h3 className="text-center text-lg text-darkGreen font-semibold mb-2">
              Features
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-2">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="bg-lightGreen text-darkGreen text-center text-xs px-2 py-1 rounded-md transition-transform duration-400 ease-in-out transform hover:scale-105 hover:font-medium shadow hover:shadow-md"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Main Info (Right Side) */}
          <div className="w-[40%] flex flex-col justify-around bg-lightGreen p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
            {/* Title */}
            <h2 className="text-2xl font-bold text-darkGreen text-center">
              {name}
            </h2>

            {/* Info Section */}
            <div className="flex justify-between items-center gap-4 mb-2">
              {/* Labels Column */}
              <div className="flex flex-col w-full items-end gap-2 text-gray-500 text-sm font-medium">
                <span>Rating</span>
                <span>Price</span>
                <span>Distance to the city center</span>
              </div>

              {/* Vertical Divider */}
              <div className="h-full w-[1px] bg-gray-400" />

              {/* Values Column */}
              <div className="flex flex-col w-full items-start gap-2 text-sm font-semibold text-gray-600">
                <span>{accommodation.rating} ★</span>
                <span>€{accommodation.price}</span>
                <span>
                  {accommodation.distance < 0.1
                    ? 'Right in the center'
                    : accommodation.distance < 1
                    ? `${accommodation.distance * 1000} m`
                    : `${accommodation.distance} km`}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <button
              type="button"
              onClick={handleBooking}
              onMouseEnter={() =>
                logEvent(EventType.Hover, {
                  targetType: 'bookNowButton',
                  accommodationId: accommodation?.id,
                })
              }
              className="flex items-center justify-between pl-4 pr-3 w-full bg-darkGreen text-white py-2 rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg group"
            >
              <span className="flex-1 text-center">Book Now</span>
              <ChevronRight
                size={16}
                className="opacity-0 transform translate-x-[-5px] transition-transform duration-300 group-hover:opacity-100 group-hover:translate-x-0"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showModal && <BookingModal name={name} onClose={handleModalClose} />}
    </div>
  );
};
