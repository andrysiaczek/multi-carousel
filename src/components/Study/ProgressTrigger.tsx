import { ProgressBar } from './ProgressBar';

type ProgressTriggerProps = {
  current: number;
  totalSteps: number;
  taskTitle?: string;
  description?: string;
  forceShow?: boolean;
  renderOnTheRight?: boolean;
};

/**
 * Hoverable info icon that shows a panel with study progress and optional task description.
 */
export const ProgressTrigger = ({
  current,
  totalSteps,
  taskTitle,
  description,
  forceShow = false,
  renderOnTheRight = false,
}: ProgressTriggerProps) => (
  <div
    className={`fixed top-4 ${
      renderOnTheRight ? 'right-4' : 'left-4'
    } group z-100`}
  >
    <div className="relative inline-block">
      {/* Icon */}
      <div className="peer w-8 h-8 flex items-center justify-center bg-darkGreen text-white rounded-full cursor-pointer transition-transform transform hover:scale-110 hover:bg-darkOrange">
        i
      </div>
      {/* Tooltip panel shown only when icon is hovered */}
      <div
        className={`absolute ${
          renderOnTheRight ? 'right-full mr-2' : 'left-full ml-2'
        } top-0 w-56 p-3 bg-antiflashWhite border border-darkGreen rounded shadow-md transition-all duration-200 ease-out transform
          ${
            forceShow
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2 peer-hover:opacity-100 peer-hover:translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="text-sm font-medium mb-2 text-darkGreen">Progress</div>

        {/* Progress Bar */}
        <ProgressBar current={current - 1} total={totalSteps} />

        {/* Task Title */}
        {taskTitle && (
          <div className="mt-3 mb-1 text-sm font-medium text-darkGreen">
            {taskTitle}
          </div>
        )}

        {/* Description Card */}
        {description && (
          <div className="mt-1 p-2 bg-white rounded-md shadow-inner text-xs text-gray-700">
            {description}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProgressTrigger;
