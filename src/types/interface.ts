import {
  BenchmarkPage,
  MultiAxisCarouselPage,
  SingleAxisCarouselPage,
} from '../pages';

export enum InterfaceOption {
  Benchmark = 'benchmark',
  SingleAxisCarousel = 'single',
  MultiAxisCarousel = 'multi',
}

export const interfaceMap = {
  [InterfaceOption.Benchmark]: {
    basePath: '/benchmark',
    resultsPagePath: `benchmark/results`,
    detailPagePath: 'benchmark/details/:id',
    option: InterfaceOption.Benchmark,
    component: BenchmarkPage,
  },
  [InterfaceOption.SingleAxisCarousel]: {
    basePath: '/single-carousel',
    resultsPagePath: 'single-carousel/results',
    detailPagePath: 'single-carousel/details/:id',
    option: InterfaceOption.SingleAxisCarousel,
    component: SingleAxisCarouselPage,
  },
  [InterfaceOption.MultiAxisCarousel]: {
    basePath: '/multi-carousel',
    resultsPagePath: 'multi-carousel/results',
    detailPagePath: 'multi-carousel/details/:id',
    option: InterfaceOption.MultiAxisCarousel,
    component: MultiAxisCarouselPage,
  },
};

export const interfacesArray = Object.values(interfaceMap);
