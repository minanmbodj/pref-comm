import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/App.css';
import './styles/components.css';
import './styles/main.css';
import { WarningDialog } from './widgets/dialogs/warningDialog';

import MovieRatingPage from './pages/MovieRatingPage';
import Survey from './pages/SurveyPage';
import SystemIntro from './pages/SystemIntro';
import AdvisorsPage from './pages/advisors/AdvisorsPage';
import Demographics from './pages/demographics/DemographicsPage';
import Welcome from './pages/welcome';

import { STRINGS } from './constants/defaults';

import {
	Participant,
	StudyStep,
	emptyParticipant,
	emptyStep,
	isEmptyParticipant,
	isEmptyStep,
	useStudy
} from 'rssa-api';

// TODO: Test the survey pages

const customBreakpoints = {
	xl: 1200,
	xxl: 1400,
	xxxl: 1800, // Custom breakpoint for viewport size greater than 1800px
	xl4: 2000
};

function App() {
	const { studyApi } = useStudy();
	const [showWarning, setShowWarning] = useState<boolean>(false);
	const [participant, setParticipant] = useState<Participant>(emptyParticipant);
	const [studyStep, setStudyStep] = useState<StudyStep>(emptyStep);
	const [checkpointUrl, setCheckpointUrl] = useState<string>('/');
	const [studyError, setStudyError] = useState<boolean>(false);

	const handleStepUpdate = (step: StudyStep, referrer: string) => {
		const newParticipant = { ...participant, current_step: step.id };
		studyApi.put('participant/', newParticipant).then(() => {
			localStorage.setItem('participant', JSON.stringify(newParticipant));
			localStorage.setItem('studyStep', JSON.stringify(step));
			localStorage.setItem('lastUrl', referrer);
		});
		setParticipant(newParticipant);
		setStudyStep(step);
		setCheckpointUrl(referrer);
	}


	useEffect(() => {
		const participantCache = localStorage.getItem('participant');
		const studyStepCache = localStorage.getItem('studyStep');
		const checkpointUrl = localStorage.getItem('lastUrl');
		if (participantCache && studyStepCache) {
			const cparticipant = JSON.parse(participantCache);
			if (!isEmptyParticipant(cparticipant)) {
				setParticipant(cparticipant);
			}
			const cstudyStep = JSON.parse(studyStepCache);
			if (!isEmptyStep(cstudyStep)) {
				setStudyStep(cstudyStep);
			}

			if (checkpointUrl) {
				setCheckpointUrl(checkpointUrl);
			}
		} else {
			studyApi.get<StudyStep>('studystep/first').then((studyStep) => {
				setStudyStep(studyStep);
				setStudyError(false);
			}).catch((error) => {
				setStudyError(true);
				console.error('Error fetching the first study step:', error);
			});
		}
	}, [studyApi]);

	useEffect(() => {
		const handleResize = () => { setShowWarning(window.innerWidth < 1200); }
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<ThemeProvider breakpoints={Object.keys(customBreakpoints)}>
			<div className="App">
				{showWarning && <WarningDialog show={showWarning} title="Warning"
					message={STRINGS.WINDOW_TOO_SMALL} disableHide={true} />
				}
				{
					studyError && <WarningDialog show={studyError} title="Error"
						message={STRINGS.STUDY_ERROR} />
				}
				<Router basename='/preference-community'>
					<Suspense fallback={<div>Loading...</div>}>
						<Routes>
							<Route path="/" element={
								<Welcome
									next="/demographics"
									checkpointUrl={checkpointUrl}
									studyStep={studyStep}
									setNewParticipant={setParticipant}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/presurvey" element={
								<Survey
									next="/systemintro"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/systemintro" element={
								<SystemIntro
									next="/ratemovies"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/ratemovies" element={
								<MovieRatingPage
									next="/advisors"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/advisors" element={
								<AdvisorsPage
									next="/postsurvey"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/demographics" element={
								<Demographics
									next="/presurvey"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/postsurvey" element={
								<Survey
									next="/feedback"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />

							{/*TODO: Fix the FeedbackPage */}
							{/* <Route path="/feedback" element={
								<FeedbackPage
									next="/quit"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>

							} /> */}
							<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
						</Routes>
					</Suspense>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;