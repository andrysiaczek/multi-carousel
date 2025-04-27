import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { StudyFlowManager } from './pages';
import './App.css';

const App = () => (
  <Router>
    <Routes>
      {/* Main study flow */}
      <Route path="/study/*" element={<StudyFlowManager />} />

      {/* Redirect root or anything else back to /study */}
      <Route path="/" element={<Navigate to="/study" replace />} />
      <Route path="*" element={<Navigate to="/study" replace />} />
    </Routes>
  </Router>
);

export default App;
