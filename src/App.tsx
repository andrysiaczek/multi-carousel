import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { EventType } from './firebase';
import { StudyFlowManager } from './pages';
import { useStudyStore } from './store';
import './App.css';

export const App = () => {
  const logEvent = useStudyStore((s) => s.logEvent);

  useEffect(() => {
    const handleBeforeUnload = () => {
      logEvent(EventType.Navigation, { to: 'pageRefresh' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [logEvent]);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<StudyFlowManager />} />
      </Routes>
    </Router>
  );
};
