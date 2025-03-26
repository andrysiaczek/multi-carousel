import { useFilterHistoryStore } from '../store';

export const FilterHistoryPanel = () => {
  const { steps, hoveredStep, goToStep } = useFilterHistoryStore();

  return (
    <div className="flex items-center gap-2 p-4 min-h-14">
      {steps.map((step, index) => (
        <div
          key={`${step.label}-${step.stepNumber}`}
          className={`px-3 py-1 text-xs text-gray-700 cursor-pointer bg-gray-300 hover:bg-lightOrange hover:text-darkOrange 
            ${index === 0 ? 'rounded-l-lg pl-4' : ''} 
            ${
              index === steps.length - 1 && !hoveredStep
                ? 'rounded-r-lg pr-4'
                : ''
            }`}
          onClick={() => goToStep(index)}
        >
          {step.label}
        </div>
      ))}

      {hoveredStep && (
        <div className="pl-3 pr-4 py-1 rounded-r-lg bg-lightOrange text-darkOrange text-xs">
          {hoveredStep}
        </div>
      )}
    </div>
  );
};
