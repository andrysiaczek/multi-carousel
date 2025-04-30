import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DetailsFor, EventType, FirebaseEvent } from '../firebase';
import { resetAllStores } from '../store';
import { InterfaceOption, StudyStep } from '../types';
import { shuffleInterfaceOptions } from '../utils';

export interface StudyState {
  sessionId: string;
  interfaceOrder: InterfaceOption[];
  stepIndex: number;
  stepsCount: number;
  steps: StudyStep[];
  isFinished: boolean;
  showInterface: boolean;
  detailModal: {
    open: boolean;
    interfaceOption?: InterfaceOption;
    itemId?: string;
  };
  resultsModal: {
    open: boolean;
    interfaceOption?: InterfaceOption;
  };
  events: FirebaseEvent[];

  nextStep: () => void;
  initOrder: (order: InterfaceOption[]) => void;
  setStepsCount: (count: number) => void;
  setSteps: (steps: StudyStep[]) => void;

  openInterface: () => void;
  closeInterface: () => void;

  openDetailModal: (opt: InterfaceOption, id: string) => void;
  closeDetailModal: () => void;

  openResultsModal: (opt: InterfaceOption) => void;
  closeResultsModal: () => void;

  logEvent: <T extends EventType>(type: T, details: DetailsFor<T>) => void;
  clearEvents: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      sessionId: uuidv4(),
      interfaceOrder: shuffleInterfaceOptions(),
      stepIndex: 0,
      stepsCount: 11,
      steps: [],
      isFinished: false,
      showInterface: false,
      events: [],
      nextStep: () => {
        const { stepIndex, stepsCount } = get();
        if (stepIndex < stepsCount - 1) {
          set({ stepIndex: stepIndex + 1 });
          resetAllStores();
        } else {
          set({ isFinished: true });
        }
      },
      initOrder: (order) => set({ interfaceOrder: order }),
      setStepsCount: (count) => set({ stepsCount: count }),
      setSteps: (steps) => set({ steps: steps }),

      openInterface: () => set({ showInterface: true }),
      closeInterface: () => set({ showInterface: false }),

      detailModal: { open: false },
      resultsModal: { open: false },

      openDetailModal: (interfaceOption, itemId) => {
        useStudyStore.getState().logEvent(EventType.Navigation, {
          to: 'detailView',
          accommodationId: itemId,
        });
        set({ detailModal: { open: true, interfaceOption, itemId } });
      },

      closeDetailModal: () => set({ detailModal: { open: false } }),

      openResultsModal: (interfaceOption) => {
        useStudyStore.getState().logEvent(EventType.Navigation, {
          to: 'resultsPage',
        });
        set({ resultsModal: { open: true, interfaceOption } });
      },

      closeResultsModal: () => set({ resultsModal: { open: false } }),

      logEvent: (type, details) => {
        const now = Date.now();
        let detailsWithDuration = details;

        if (type === EventType.TaskEnd) {
          const { events } = get();
          const startEvent = events.find((e) => e.type === EventType.TaskStart);
          const durationMs = startEvent
            ? now - startEvent.timestamp
            : undefined;
          detailsWithDuration = { ...details, durationMs };
        }

        set((state) => ({
          events: [
            ...state.events,
            {
              timestamp: Date.now(),
              type,
              details: detailsWithDuration,
            } as FirebaseEvent,
          ],
        }));
      },

      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'study-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
