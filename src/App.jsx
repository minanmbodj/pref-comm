import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdvisorsPage from './pages/advisors/AdvisorsPage';
// import MainLandingPage from './pages/MainLandingPage';
import Welcome from './pages/welcome';
import MovieRatingPage from './pages/ratemovies/MovieRatingPage';
import Survey from './pages/survey';
import SystemIntro from './pages/SystemIntro';
import FeedbackPage from './pages/feedbackPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Preference Community</h1>
      </header>
      <Router basename='/preference-community'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Welcome next="/presurvey"/>} />
            <Route path="/presurvey" element={<Survey next="/systemintro"/>} /> 
            <Route path="/systemintro" element={<SystemIntro next="/ratemovies"/>} />
            <Route path="/ratemovies" element={<MovieRatingPage next="/advisors"/>} />
            <Route path="/advisors" element={<AdvisorsPage next="/feedback"/>} />
            <Route path="/feedback" element={<FeedbackPage next="/quit"/>} />
            <Route path="/quit" element={<h1>Thank you for participating!</h1>} />

          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
