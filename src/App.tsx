import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { DetailPage, MultiAxisCarouselPage, ResultsPage } from './pages';
import { interfacesArray } from './types';
import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MultiAxisCarouselPage />} />

      {interfacesArray.map(
        ({
          basePath,
          resultsPagePath,
          detailPagePath,
          component: Component,
          option,
        }) => (
          <Route key={option}>
            <Route path={basePath} element={<Component />} />
            <Route
              path={resultsPagePath}
              element={<ResultsPage interfaceOption={option} />}
            />
            <Route
              path={detailPagePath}
              element={<DetailPage interfaceOption={option} />}
            />
          </Route>
        )
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
