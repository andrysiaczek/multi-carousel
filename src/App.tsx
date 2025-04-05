import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CarouselPage, DetailPage, ResultsPage } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarouselPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
