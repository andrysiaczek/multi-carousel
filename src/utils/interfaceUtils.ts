import { Accommodation, InterfaceOption, interfaceMap } from '../types';

export const generateDetailPageUrl = (
  interfaceOption: InterfaceOption,
  accommodationId: string
) => {
  const basePath =
    interfaceMap[interfaceOption].basePath ||
    interfaceMap[InterfaceOption.Benchmark].basePath;
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
