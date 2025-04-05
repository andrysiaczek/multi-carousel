import { useNavigate } from 'react-router-dom';
import { ResetButtonFilterHistory as ResetButton } from '../../components';
import { accommodationDataset } from '../../data';
import { useCarouselStore, useFilterHistoryStore } from '../../store';

export const FilterHistoryPanel = () => {
  const { steps, hoveredStepLabel, goToStep } = useFilterHistoryStore();
  const navigate = useNavigate();

  // Calculate the number of unique filtered accommodations from dataPerCell
  const filteredAccommodations = useCarouselStore().getFilteredAccommodations();
  const filteredAccommodationsCount = filteredAccommodations.length;

  const isDataFiltered =
    filteredAccommodationsCount < accommodationDataset.length;
  const showResultsText = isDataFiltered
    ? `Show Filtered Results (${filteredAccommodationsCount})`
    : 'Show All Results';

  const handleShowResults = () => {
    // Set the filtered accommodations and navigate to results
    localStorage.setItem(
      'filteredAccommodations',
      JSON.stringify(filteredAccommodations)
    );
    navigate('/results');
  };

  return (
    <div className="flex items-center justify-between gap-2 p-4 min-h-14 mx-4">
      <div className="flex items-center gap-2">
        {/* Initial step - Reset button */}
        {(steps.length > 1 || hoveredStepLabel) && (
          <ResetButton
            onClick={() => goToStep(0)}
            inHoverState={steps.length === 1 && !!hoveredStepLabel}
          />
        )}
      </div>

      {/* Filter history steps */}
      {steps.map((step, index) =>
        index === 0 ? null : (
          <div
            key={`${step.label}-${step.stepNumber}`}
            className={`px-3 py-1 text-xs text-gray-700 cursor-pointer bg-gray-300 hover:bg-lightOrange hover:text-darkOrange 
            ${
              index === 1 && steps.length <= 2 && !hoveredStepLabel
                ? 'rounded-r-lg pr-4'
                : ''
            }
            ${index === 1 && steps.length > 2 ? 'pl-4' : ''}
            ${
              index === steps.length - 1 && !hoveredStepLabel
                ? 'rounded-r-lg pr-4'
                : ''
            }`}
            onClick={() => goToStep(index)}
          >
            {step.label}
          </div>
        )
      )}

      {/* Hover preview step */}
      {hoveredStepLabel && (
        <div className="pl-3 pr-4 py-1 rounded-r-lg bg-lightOrange text-darkOrange text-xs">
          {hoveredStepLabel}
        </div>
      )}

      {/* Show Results Button */}
      <button
        type="button"
        className="ml-auto px-4 py-1.5 text-xs font-semibold bg-lightOrange text-darkOrange rounded-lg hover:bg-darkOrange hover:text-lightOrange transition"
        onClick={handleShowResults}
      >
        {showResultsText}
      </button>
    </div>
  );
};
