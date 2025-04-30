import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, StudyStepLog } from '../firebase';
import { useStudyStore } from '../store';
import { InterfaceOption } from '../types';

/**
 * Call this once on app start to sign in anonymously.
 * Returns a promise that resolves when the user is signed in.
 */
export function initAnonymousAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already signed in, resolve immediately
    if (auth.currentUser) {
      resolve();
      return;
    }

    // Listen for auth state change (fires after signInAnonymously below)
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve();
      }
    });

    // Kick off anonymous sign-in
    signInAnonymously(auth).catch((err) => {
      unsub();
      reject(err);
    });
  });
}

export async function flushStepLog(
  taskType: 'exploratory' | 'goal' | 'survey',
  interfaceOption?: InterfaceOption
) {
  const { sessionId, interfaceOrder, events, clearEvents } =
    useStudyStore.getState();

  // build a safe doc ID, e.g. "multi_exploratory"
  const docId = `${interfaceOption ?? 'final'}_${taskType}`;

  const stepLog: StudyStepLog = {
    sessionId,
    interfaceOption: interfaceOption ?? null,
    taskType,
    events,
    createdAt: serverTimestamp(),
    interfaceOrder,
  };

  await setDoc(
    doc(db, 'multi-carousel-study', sessionId, 'steps', docId),
    stepLog
  );

  clearEvents();
}
