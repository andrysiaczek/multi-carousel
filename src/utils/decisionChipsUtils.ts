import { useDecisionChipsStore } from '../store';
import { Accommodation, decisionChips } from '../types';

const calculateFeatureFrequency = (accommodations: Accommodation[]) => {
  const { selectedChips } = useDecisionChipsStore.getState();
  const featureCounts: Record<string, number> = {};

  accommodations.forEach((acc) => {
    acc.features.forEach((feature) => {
      if (decisionChips.includes(feature)) {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      }
    });
  });

  const threshold = Math.ceil(accommodations.length * 0.3);
  const popularFeatures = decisionChips.filter(
    (feature) => (featureCounts[feature] || 0) >= threshold
  );

  // Always include selected chips even if they don't meet the threshold
  const allFeatures = Array.from(
    new Set([...popularFeatures, ...selectedChips])
  );

  return allFeatures;
};

export const updateAvailableChips = (
  filteredAccommodations: Accommodation[]
) => {
  const popularFeatures = calculateFeatureFrequency(filteredAccommodations);
  useDecisionChipsStore.getState().setAvailableChips(popularFeatures);
};
