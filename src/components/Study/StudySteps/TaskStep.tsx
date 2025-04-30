import { EventType } from '../../../firebase';
import { useStudyStore } from '../../../store';
import {
  InterfaceOption,
  StudyStep,
  exploratoryTask,
  goalTask,
} from '../../../types';

type TaskStepProps = {
  step: StudyStep & { type: 'task' };
  interfaceName: string;
  showInterface: boolean;
  componentMap: Record<
    InterfaceOption,
    {
      Component: React.ComponentType;
      name: string;
    }
  >;
  onBegin: () => void;
};

export const TaskStep = ({
  step,
  interfaceName,
  showInterface,
  componentMap,
  onBegin,
}: TaskStepProps) => {
  const { Component: TaskComponent } = componentMap[step.option];
  const isExploratory = step.subtype === 'exploratory';
  const taskText = isExploratory ? exploratoryTask : goalTask;
  const badgeText = isExploratory ? 'Browse Freely' : 'Targeted Search';
  const badgeStyle = isExploratory
    ? 'bg-lightGreen text-darkGreen'
    : 'bg-lightOrange text-darkOrange';

  if (!showInterface) {
    return (
      <div className="flex items-center justify-center h-screen bg-antiflashWhite p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm uppercase tracking-wide text-gray-500">
              {interfaceName}
            </span>
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${badgeStyle}`}
            >
              {badgeText}
            </span>
          </div>
          <h2
            className={`text-2xl font-bold mb-3 ${
              isExploratory ? 'text-darkGreen' : 'text-darkOrange'
            }`}
          >
            {isExploratory ? 'Step 1: Explore' : 'Step 2: Find Your Deal'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {taskText}
          </p>
          <button
            type="button"
            onClick={() => {
              useStudyStore
                .getState()
                .logEvent(EventType.TaskStart, { taskType: step.subtype });
              onBegin();
            }}
            className={`w-full py-3 rounded-lg text-white text-lg font-medium transition ${
              isExploratory
                ? 'bg-darkGreen hover:bg-darkGreen/90'
                : 'bg-darkOrange hover:bg-darkOrange/90'
            }`}
          >
            Let’s go!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-black">
      <TaskComponent />
    </div>
  );
};
