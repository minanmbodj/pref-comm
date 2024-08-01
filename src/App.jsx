import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdvisorsPage from './pages/advisors/AdvisorsPage';
import MainLandingPage from './pages/MainLandingPage';
import MovieRatingPage from './pages/ratemovies/MovieRatingPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Preference Community</h1>
      </header>
      <Router basename='/preference-community'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainLandingPage />} />
            <Route path="/ratemovies" element={<MovieRatingPage />} />
            <Route path="/advisors" element={<AdvisorsPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
