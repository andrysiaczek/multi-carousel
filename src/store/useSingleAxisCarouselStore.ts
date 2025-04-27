import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FilterOption } from '../types';

interface CarouselState {
  titles: Record<FilterOption, number>;
  scrolls: Record<FilterOption, number>;
  setTitleIndex: (option: FilterOption, index: number) => void;
  setScrollPosition: (option: FilterOption, pos: number) => void;
  resetState: () => void;
}

const initialTitlesState = {
  [FilterOption.Distance]: 0,
  [FilterOption.Price]: 2,
  [FilterOption.Rating]: 2,
  [FilterOption.Type]: 4,
};

const initialScrollsState = {
  [FilterOption.Distance]: 0,
  [FilterOption.Price]: 0,
  [FilterOption.Rating]: 0,
  [FilterOption.Type]: 0,
};

export const useSingleAxisCarouselStore = create<CarouselState>()(
  persist(
    (set) => ({
      titles: initialTitlesState,
      scrolls: initialScrollsState,
      setTitleIndex: (option, index) =>
        set((state) => ({
          titles: { ...state.titles, [option]: index },
        })),
      setScrollPosition: (option, position) =>
        set((state) => ({
          scrolls: { ...state.scrolls, [option]: position },
        })),
      resetState: () =>
        set({
          titles: initialTitlesState,
          scrolls: initialScrollsState,
        }),
    }),
    {
      name: 'single-axis-carousel-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
