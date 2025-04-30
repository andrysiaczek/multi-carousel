import React, { useMemo } from 'react';
import {
  FinalSurveyStep,
  IntroStep,
  ProgressTrigger,
  SurveyStep,
  TaskStep,
  ThankYouStep,
} from '../components';
import { EventType, flushStepLog } from '../firebase';
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
    name: 'Multi-directional Interface',
  },
  [InterfaceOption.SingleAxisCarousel]: {
    Component: SingleAxisCarouselPage,
    name: 'Netflix-style Interface',
  },
  [InterfaceOption.Benchmark]: {
    Component: BenchmarkPage,
    name: 'Booking-style Interface',
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
    logEvent,
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

  const step = steps[stepIndex];

  if (isFinished) {
    return <ThankYouStep />;
  }
  if (
    detailModal.open &&
    detailModal.interfaceOption &&
    detailModal.itemId &&
    step.type == 'task'
  ) {
    return (
      <DetailPage
        interfaceOption={detailModal.interfaceOption}
        id={detailModal.itemId}
        stepType={step.subtype}
        onBook={async () => flushStepLog(step.subtype, step.option)}
      />
    );
  }
  if (resultsModal.open && resultsModal.interfaceOption) {
    return <ResultsPage interfaceOption={resultsModal.interfaceOption} />;
  }

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
          onSubmit={async (answers) => {
            logEvent(EventType.Survey, {
              quantitative: answers.quantitative,
              qualitative: answers.qualitative,
            });

            await flushStepLog('survey', step.option);
            nextStep();
          }}
        />
      )}
      {step.type === 'final' && (
        <FinalSurveyStep
          onSubmit={async (answers) => {
            logEvent(EventType.Survey, {
              quantitative: answers.quantitative,
              qualitative: answers.qualitative,
            });

            await flushStepLog('survey');
            nextStep();
          }}
        />
      )}
    </div>
  );
};
