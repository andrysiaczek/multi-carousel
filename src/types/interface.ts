export enum InterfaceOption {
  Benchmark = 'benchmark',
  SingleAxisCarousel = 'single',
  MultiAxisCarousel = 'multi',
}

export const interfaceLabels: Record<InterfaceOption, string> = {
  [InterfaceOption.MultiAxisCarousel]: 'Multi-directional Interface',
  [InterfaceOption.SingleAxisCarousel]: 'Netflix-style Interface',
  [InterfaceOption.Benchmark]: 'Booking-style Interface',
};
