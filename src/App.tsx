import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdvisorsPage from './pages/advisors/AdvisorsPage';
import Welcome from './pages/welcome';
import MovieRatingPage from './pages/ratemovies/MovieRatingPage';
import Survey from './pages/survey';
import SystemIntro from './pages/SystemIntro';
import PostSurvey from './pages/postSurvey';
import FeedbackPage from './pages/feedbackPage';
import { useStudy } from 'rssa-api';

const App: React.FC = () => {

  const { studyApi } = useStudy();

  return (
    <div className="App">
      <Router basename='/preference-community'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Welcome next="/presurvey"/>} />
            {/* <Route path="/presurvey" element={<Survey next="/systemintro"/>} /> 
            <Route path="/systemintro" element={<SystemIntro next="/ratemovies"/>} />
            <Route path="/ratemovies" element={<MovieRatingPage next="/advisors"/>} />
            <Route path="/advisors" element={<AdvisorsPage next="/postsurvey"/>} />
            <Route path="/postsurvey" element={<PostSurvey next="/feedback"/>} />
            <Route path="/feedback" element={<FeedbackPage next="/quit"/>} />
            <Route path="/quit" element={<h1>Thank you for participating!</h1>} /> */}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;