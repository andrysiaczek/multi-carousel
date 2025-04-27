import {
  useAxisFilterStore,
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
  useFilterSidebarStore,
  useSingleAxisCarouselStore,
  useSortStore,
} from '.';

export function resetAllStores() {
  useAxisFilterStore.getState().resetState();
  useCarouselStore.getState().resetState();
  useDecisionChipsStore.getState().resetState();
  useFilterSidebarStore.getState().resetState();
  useFilterHistoryStore.getState().resetState();
  useSingleAxisCarouselStore.getState().resetState();
  useSortStore.getState().resetState();
}
