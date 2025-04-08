import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BenchmarkPage, CarouselPage, DetailPage, ResultsPage } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarouselPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
