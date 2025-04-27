import { Accommodation, InterfaceOption } from '../types';

export const resolveAccommodationVariant = (
  interfaceOption: InterfaceOption,
  accommodation: Accommodation
) => {
  switch (interfaceOption) {
    case InterfaceOption.Benchmark:
      return {
        name: accommodation.versionBenchmark.name,
        location: accommodation.versionBenchmark.location,
        images: accommodation.versionBenchmark.images,
      };
    case InterfaceOption.SingleAxisCarousel:
      return {
        name: accommodation.versionSingleAxisCarousel.name,
        location: accommodation.versionSingleAxisCarousel.location,
        images: accommodation.versionSingleAxisCarousel.images,
      };
    case InterfaceOption.MultiAxisCarousel:
      return {
        name: accommodation.versionMultiAxisCarousel.name,
        location: accommodation.versionMultiAxisCarousel.location,
        images: accommodation.versionMultiAxisCarousel.images,
      };
    default:
      return {
        name: accommodation.versionBenchmark.name,
        location: accommodation.versionBenchmark.location,
        images: accommodation.versionBenchmark.images,
      };
  }
};

/**
 * Returns the values of the InterfaceOption enum in a random order.
 */
export const shuffleInterfaceOptions = () => {
  const values = Object.values(InterfaceOption) as InterfaceOption[];

  // Fisher–Yates shuffle in‐place
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  return values;
};
