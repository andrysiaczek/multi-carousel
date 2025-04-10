import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import {
  BenchmarkPage,
  DetailPage,
  MultiAxisCarouselPage,
  ResultsPage,
  SingleAxisCarouselPage,
} from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MultiAxisCarouselPage />} />
        <Route
          path="/benchmark/carousel"
          element={<SingleAxisCarouselPage />}
        />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
