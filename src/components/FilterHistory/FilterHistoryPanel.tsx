import { useFilterHistoryStore } from '../../store';
import { ResetButton } from '.';

export const FilterHistoryPanel = () => {
  const { steps, hoveredStepLabel, goToStep } = useFilterHistoryStore();

  return (
    <div className="flex items-center gap-2 p-4 min-h-14">
      {/* Initial step - Reset button */}
      {(steps.length > 1 || hoveredStepLabel) && (
        <ResetButton
          onClick={() => goToStep(0)}
          inHoverState={steps.length === 1 && !!hoveredStepLabel}
        />
      )}

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
    </div>
  );
};
