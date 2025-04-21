import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import {
  BenchmarkPage,
  DetailPage,
  MultiAxisCarouselPage,
  ResultsPage,
  SingleAxisCarouselPage,
} from './pages';
import { InterfaceOption } from './types';
import './App.css';

const interfaces = [
  {
    path: 'benchmark',
    option: InterfaceOption.Benchmark,
    component: BenchmarkPage,
  },
  {
    path: 'single-carousel',
    option: InterfaceOption.SingleAxisCarousel,
    component: SingleAxisCarouselPage,
  },
  {
    path: 'multi-carousel',
    option: InterfaceOption.MultiAxisCarousel,
    component: MultiAxisCarouselPage,
  },
];

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MultiAxisCarouselPage />} />

      {interfaces.map(({ path, option, component: Component }) => (
        <Route key={path}>
          <Route path={`/${path}`} element={<Component />} />
          <Route
            path={`/${path}/results`}
            element={<ResultsPage interfaceOption={option} />}
          />
          <Route
            path={`/${path}/details/:id`}
            element={<DetailPage interfaceOption={option} />}
          />
        </Route>
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
