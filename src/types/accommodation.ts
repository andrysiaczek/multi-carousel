export type Accommodation = {
  id: string;
  versionBenchmark: AccommodationVersion;
  versionSingleAxisCarousel: AccommodationVersion;
  versionMultiAxisCarousel: AccommodationVersion;
  price: number;
  rating: number;
  distance: number;
  type: string;
  features: string[];
};

type AccommodationVersion = {
  name: string;
  location: Location;
  images: string[];
};

type Location = { lat: number; lng: number };
