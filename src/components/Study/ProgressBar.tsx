export type ProgressBarProps = {
  current: number;
  total: number;
};

/**
 * A horizontal progress bar with vertical tick marks to show total steps number.
 */
export const ProgressBar = ({ current, total }: ProgressBarProps) => (
  <div className="relative flex w-full h-2 rounded mb-4 overflow-hidden">
    {Array.from({ length: total }, (_, i) => {
      let bgClass = 'bg-gray-200';
      if (i < current) bgClass = 'bg-darkGreen'; // done
      else if (i === current) bgClass = 'bg-darkGreen/50'; // in-progress

      return (
        <div key={i} className="flex-1 relative">
          <div className={`h-full ${bgClass}`} />

          {/* tick: a 1px white line on the right edge except after last */}
          {i < total - 1 && (
            <div className="absolute top-0 right-0 bottom-0 w-px bg-antiflashWhite" />
          )}
        </div>
      );
    })}
  </div>
);
