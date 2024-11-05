import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { StudyProvider } from 'rssa-api';
import AdvisorsPage from './pages/advisors/AdvisorsPage';
import Welcome from './pages/welcome';
import MovieRatingPage from './pages/ratemovies/MovieRatingPage';
import Survey from './pages/survey';
import SystemIntro from './pages/SystemIntro';
import PostSurvey from './pages/postSurvey';
import FeedbackPage from './pages/feedbackPage';
import DemographicsPage from './pages/demographics/DemographicsPage';

const providerConfig = {
  api_url_base: process.env.REACT_APP_RSSA_API,
  study_id: process.env.REACT_APP_RSSA_STUDY_ID
};

function App() {
  return (
    <div className="App">
      <StudyProvider config={providerConfig}>
        <Router basename='/preference-community'>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Welcome next="/presurvey"/>} />
              <Route path="/presurvey" element={<Survey next="/systemintro"/>} /> 
              <Route path="/systemintro" element={<SystemIntro next="/ratemovies"/>} />
              <Route path="/ratemovies" element={<MovieRatingPage next="/advisors"/>} />
              <Route path="/advisors" element={<AdvisorsPage next="/postsurvey"/>} />
              <Route path="/postsurvey" element={<PostSurvey next="/feedback"/>} />
              <Route path="/feedback" element={<FeedbackPage next="/quit"/>} />
              <Route path="/quit" element={<h1>Thank you for participating!</h1>} />
            </Routes>
          </Suspense>
        </Router>
      </StudyProvider>
    </div>
  );
}

export default App;