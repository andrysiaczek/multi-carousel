import React, { useMemo } from 'react';
import {
  FinalSurveyStep,
  IntroStep,
  ProgressTrigger,
  SurveyStep,
  TaskStep,
  ThankYouStep,
} from '../components';
import {
  BenchmarkPage,
  DetailPage,
  MultiAxisCarouselPage,
  ResultsPage,
  SingleAxisCarouselPage,
} from '../pages';
import { useStudyStore } from '../store';
import {
  exploratoryTask,
  goalTask,
  InterfaceOption,
  StudyStep,
} from '../types';

// Map each InterfaceOption to its corresponding component and display name
const componentMap: Record<
  InterfaceOption,
  {
    Component: React.ComponentType;
    name: string;
  }
> = {
  [InterfaceOption.MultiAxisCarousel]: {
    Component: MultiAxisCarouselPage,
    name: 'Multi-Axis Carousel',
  },
  [InterfaceOption.SingleAxisCarousel]: {
    Component: SingleAxisCarouselPage,
    name: 'Single-Axis Carousel',
  },
  [InterfaceOption.Benchmark]: {
    Component: BenchmarkPage,
    name: 'Benchmark Interface',
  },
};

export const StudyFlowManager = () => {
  const {
    detailModal,
    interfaceOrder,
    isFinished,
    showInterface,
    openInterface,
    resultsModal,
    stepIndex,
    nextStep,
  } = useStudyStore();

  // Build the flat steps array whenever interfaceOrder changes
  const steps = useMemo<StudyStep[]>(() => {
    const seq: StudyStep[] = [{ type: 'intro' }];

    interfaceOrder.forEach((option) => {
      seq.push({ type: 'task', subtype: 'exploratory', option });
      seq.push({ type: 'task', subtype: 'goal', option });
      seq.push({ type: 'survey', option });
    });

    seq.push({ type: 'final' });
    return seq;
  }, [interfaceOrder]);

  if (isFinished) {
    return <ThankYouStep />;
  }
  if (detailModal.open && detailModal.interfaceOption && detailModal.itemId) {
    return (
      <DetailPage
        interfaceOption={detailModal.interfaceOption}
        id={detailModal.itemId}
      />
    );
  }
  if (resultsModal.open && resultsModal.interfaceOption) {
    return <ResultsPage interfaceOption={resultsModal.interfaceOption} />;
  }

  const step = steps[stepIndex];

  const taskDescription =
    step.type === 'task'
      ? step.subtype === 'exploratory'
        ? exploratoryTask
        : goalTask
      : undefined;

  return (
    <div className="relative w-full h-full text-black bg-antiflashWhite">
      <ProgressTrigger
        current={stepIndex}
        totalSteps={steps.length - 1}
        taskTitle={
          step.type === 'task'
            ? step.subtype === 'exploratory'
              ? 'Exploratory Task'
              : 'Goal-Oriented Task'
            : undefined
        }
        description={taskDescription}
        renderOnTheRight={
          step.type === 'task' && step.option === InterfaceOption.Benchmark
        }
      />
      {step.type === 'intro' && <IntroStep onStart={nextStep} />}
      {step.type === 'task' && (
        <TaskStep
          step={step}
          interfaceName={componentMap[step.option].name}
          showInterface={showInterface}
          componentMap={componentMap}
          onBegin={openInterface}
        />
      )}
      {step.type === 'survey' && (
        <SurveyStep
          interfaceOption={step.option}
          onSubmit={() => {
            nextStep();
          }}
        />
      )}
      {step.type === 'final' && (
        <FinalSurveyStep
          onSubmit={() => {
            nextStep();
          }}
        />
      )}
    </div>
  );
};
