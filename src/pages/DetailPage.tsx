import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowButton, LoadingMessage, MapLibreMap } from '../components';
import { accommodationDataset } from '../data';
import { Accommodation } from '../types';

export const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const navigate = useNavigate();

  // Fetch accommodation data
  useEffect(() => {
    setAccommodation(accommodationDataset.find((acc) => acc.id === id) || null);
  }, [id]);

  // Image navigation handlers
  const handleNextImage = useCallback(() => {
    if (accommodation) {
      setActiveImageIndex((prev) => (prev + 1) % accommodation.images.length);
    }
  }, [accommodation]);

  const handlePrevImage = useCallback(() => {
    if (accommodation) {
      setActiveImageIndex(
        (prev) =>
          (prev - 1 + accommodation.images.length) % accommodation.images.length
      );
    }
  }, [accommodation]);

  const handleDotClick = (index: number) => setActiveImageIndex(index);

  // Auto slide on gallery
  useEffect(() => {
    if (!accommodation) return;
    const interval = setInterval(handleNextImage, 2000);
    return () => clearInterval(interval);
  }, [accommodation, handleNextImage]);

  const handleBooking = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 5000);
  };

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
              src={accommodation.images[activeImageIndex]}
              alt={accommodation.nameI}
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
              {accommodation.images.map((imagePath, index) => (
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
              onClick={() => navigate(-1)}
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
              latitude={accommodation.locationI.lat}
              longitude={accommodation.locationI.lng}
              zoom={13}
              title={accommodation.nameI}
            />
          </div>
        </div>

        {/* Lower Half: Features + Main Info */}
        <div className="flex w-full h-1/3 space-x-4">
          {/* Features (Left Side) */}
          <div className="w-[60%] bg-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
            <h3 className="text-center text-lg text-darkGreen font-semibold mb-2">
              Features
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {accommodation.features.slice(0, 12).map((feature) => (
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
          <div className="w-[40%] flex flex-col justify-between bg-lightGreen p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
            {/* Title */}
            <h2 className="text-2xl font-bold text-darkGreen text-center">
              {accommodation.nameI}
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
                  {accommodation.distance === 0
                    ? 'Right in the center'
                    : `${accommodation.distance} km`}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <button
              type="button"
              onClick={handleBooking}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
            <p className="text-gray-600">
              Enjoy your stay at {accommodation.nameI}!
            </p>
            <div className="text-4xl mt-2 animate-bounce">🎉</div>
          </div>
        </div>
      )}
    </div>
  );
};
