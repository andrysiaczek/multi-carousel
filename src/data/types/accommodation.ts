export type Accommodation = {
  id: string;
  nameI: string;
  price: number;
  rating: number;
  distance: number;
  type: string;
  features: string[];
  locationI: { lat: number; lng: number };
  imagesI: string[];
};
