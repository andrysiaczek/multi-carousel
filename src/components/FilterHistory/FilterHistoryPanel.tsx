import { ResetButtonFilterHistory as ResetButton } from '../../components';
import { accommodationDataset } from '../../data';
import { EventType } from '../../firebase';
import {
  useAxisFilterStore,
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
  useSortStore,
  useStudyStore,
} from '../../store';
import { InterfaceOption, SortOption } from '../../types';

export const FilterHistoryPanel = () => {
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();
  const { getFilteredAccommodations } = useCarouselStore();
  const { selectedChips } = useDecisionChipsStore();
  const { steps, hoveredStepLabel, goToStep } = useFilterHistoryStore();
  const { setAccommodations, setSortField } = useSortStore();
  const { openResultsModal, logEvent } = useStudyStore();

  // Calculate the number of unique filtered accommodations from dataPerCell
  const filteredAccommodations = getFilteredAccommodations();
  const filteredAccommodationsCount = filteredAccommodations.length;
  const noFilteredResults = filteredAccommodationsCount === 0;

  const isDataFiltered =
    filteredAccommodationsCount < accommodationDataset.length;
  const showResultsText = isDataFiltered
    ? `Show Filtered Results (${filteredAccommodationsCount})`
    : 'Show All Results';

  const handleStepClick = (
    index: number,
    isOnlyOneStepNoHoveredStep: boolean,
    isLastStepNoHoveredStep: boolean
  ) => {
    if (!isOnlyOneStepNoHoveredStep && !isLastStepNoHoveredStep)
      goToStep(index);
  };

  const handleShowResults = () => {
    if (isDataFiltered) {
      logEvent(EventType.Click, {
        targetType: 'showFilteredResults',
        xAxis: { filterType: xAxisFilter },
        yAxis: { filterType: yAxisFilter },
        featuresApplied: selectedChips,
        filterHistorySteps: steps.map((step) => step.label),
        accommodationIds: getFilteredAccommodations().map((acc) => acc.id),
      });
    } else {
      logEvent(EventType.Click, {
        targetType: 'showAllResults',
        xAxis: { filterType: xAxisFilter },
        yAxis: { filterType: yAxisFilter },
      });
    }

    setAccommodations(filteredAccommodations);
    if (
      Object.values(SortOption).includes(xAxisFilter as unknown as SortOption)
    ) {
      setSortField(xAxisFilter as unknown as SortOption);
    }
    openResultsModal(InterfaceOption.MultiAxisCarousel);
  };

  return (
    <div className="flex items-center justify-between gap-2 px-8 min-h-14">
      <div className="flex items-center gap-2">
        {/* Initial step - Reset button */}
        {(steps.length > 1 || hoveredStepLabel) && (
          <ResetButton
            onClick={() => {
              logEvent(EventType.FilterReset, {
                filterType: 'filterHistory',
                numberOfSteps: steps.length - 1,
              });
              goToStep(0);
            }}
            isHighlighted={noFilteredResults}
            isPreviewing={steps.length === 1 && !!hoveredStepLabel}
          />
        )}
      </div>

      {/* Filter history steps */}
      {steps.map((step, index) => {
        const isOnlyOneStepNoHoveredStep =
          index === 1 && steps.length <= 2 && !hoveredStepLabel;
        const isFirstStepNoHoveredStep = index === 1 && steps.length > 2;
        const isLastStepNoHoveredStep =
          index === steps.length - 1 && !hoveredStepLabel;

        return index === 0 ? null : (
          <div
            key={`${step.label}-${step.stepNumber}`}
            className={`px-3 py-1 text-xs bg-gray-300 text-gray-700
              ${
                isOnlyOneStepNoHoveredStep || isLastStepNoHoveredStep
                  ? 'rounded-r-lg pr-4 hover:bg-gray-300 hover:text-gray-700 cursor-not-allowed rounded-r-lg pr-4'
                  : 'cursor-pointer hover:bg-darkOrange hover:text-lightOrange'
              }
              ${isFirstStepNoHoveredStep ? 'pl-4' : ''}
            `}
            onClick={() =>
              handleStepClick(
                index,
                isOnlyOneStepNoHoveredStep,
                isLastStepNoHoveredStep
              )
            }
          >
            {step.label}
          </div>
        );
      })}

      {/* Hover preview step */}
      {hoveredStepLabel && (
        <div className="pl-3 pr-4 py-1 rounded-r-lg bg-lightOrange text-darkOrange text-xs">
          {hoveredStepLabel}
        </div>
      )}

      {/* Show Results Button */}
      <button
        type="button"
        className={`ml-auto px-4 py-1.5 text-xs font-semibold rounded-lg transition  
      ${
        noFilteredResults
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-lightOrange text-darkOrange hover:bg-darkOrange hover:text-lightOrange cursor-pointer'
      }`}
        onClick={handleShowResults}
        onMouseEnter={() => {
          if (isDataFiltered) {
            return logEvent(EventType.Hover, {
              targetType: 'showFilteredResults',
              xAxis: { filterType: xAxisFilter },
              yAxis: { filterType: yAxisFilter },
              featuresApplied: selectedChips,
              filterHistorySteps: steps.map((step) => step.label),
              accommodationIds: getFilteredAccommodations().map(
                (acc) => acc.id
              ),
            });
          }

          logEvent(EventType.Hover, {
            targetType: 'showAllResults',
            xAxis: { filterType: xAxisFilter },
            yAxis: { filterType: yAxisFilter },
          });
        }}
        disabled={noFilteredResults}
      >
        {showResultsText}
      </button>
    </div>
  );
};
