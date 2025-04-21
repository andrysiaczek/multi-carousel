import { Accommodation, InterfaceOption } from '../types';

const detailPathMap = {
  [InterfaceOption.Benchmark]: '/benchmark',
  [InterfaceOption.SingleAxisCarousel]: '/single-carousel',
  [InterfaceOption.MultiAxisCarousel]: '/multi-carousel',
};

export const generateDetailPageUrl = (
  interfaceOption: InterfaceOption,
  accommodationId: string
) => {
  const basePath =
    detailPathMap[interfaceOption] || detailPathMap[InterfaceOption.Benchmark];
  return `${basePath}/details/${accommodationId}`;
};

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
