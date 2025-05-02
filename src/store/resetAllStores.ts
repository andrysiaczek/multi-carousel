import {
  useAxisFilterStore,
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
  useSingleAxisCarouselStore,
  useSortStore,
} from '.';

export function resetAllStores() {
  useAxisFilterStore.getState().resetState();
  useCarouselStore.getState().resetState();
  useDecisionChipsStore.getState().resetState();
  useFilterHistoryStore.getState().resetState();
  useSingleAxisCarouselStore.getState().resetState();
  useSortStore.getState().resetState();
}
