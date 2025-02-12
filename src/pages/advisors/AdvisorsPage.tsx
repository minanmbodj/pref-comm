import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { useLocation, useNavigate } from 'react-router-dom';
import {
	CurrentStep, StudyStep,
	useStudy
} from "rssa-api";
import LoadingScreen from '../../widgets/loadingscreen/LoadingScreen';
import { MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import NextButton from "../../widgets/nextButton";
import { StudyPageProps } from '../StudyPage.types';
import AdvisorsWidget from "./components/AdvisorsWidget";


type AdvisorRecItemDetail = {
	id: string; // This will likely be a UUID string
	// TODO: Add the rest of the fields by checking the API response
}

type AdvisorRequestObj = {
	// TODO: Add the rest of the fields by checking the API request
}

// TODO: Implement the request.
// Keeping all the previous code commented as reference for what is expected.

// export default function AdvisorsPage(props) {
const AdvisorsPage: React.FC<StudyPageProps> = ({
	next,
	checkpointUrl,
	participant,
	studyStep,
	updateCallback,
	sizeWarning
}) => {
	// const userdata = useLocation().state.user;
	// const stepid = useLocation().state.studyStep;

	// const navigate = useNavigate();
	// const [studyStep, setStudyStep] = useState(props.studyStep);
	const { studyApi } = useStudy();
	const navigate = useNavigate();
	const location = useLocation();
	// We are grabbing the rated movies from the preference elicitation step
	const stateData = location.state as any;
	const ratedMovies = useRef<Map<number, MovieRating>>(stateData?.ratedMovies || new Map<number, MovieRating>());
	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (checkpointUrl !== '/' && checkpointUrl !== location.pathname) {
			navigate(checkpointUrl);
		}
	}, [checkpointUrl, location.pathname, navigate]);

	const handleNextBtn = useCallback(() => {
		studyApi.post<CurrentStep, StudyStep>('studystep/next', {
			current_step_id: participant.current_step
		}).then((nextStep: StudyStep) => {
			updateCallback(nextStep, next)
			setIsUpdated(true);
		});
	}, [studyApi, participant, updateCallback, next])

	useEffect(() => {
		if (isUpdated) {
			navigate(next);
		}
	}, [isUpdated, navigate, next]);

	useEffect(() => {
		if (ratedMovies.current === undefined) {
			const storedRatedMovies = localStorage.getItem('ratedMoviesData');
			if (storedRatedMovies) {
				ratedMovies.current = JSON.parse(storedRatedMovies);
			}
		}
	}, [ratedMovies]);
	

	const [starttime] = useState(new Date());

	// const state = useLocation().state;
	// const [loading, setLoading] = useState(true);
	// const [recommendations, setRecommendations] = useState([]);
	const [advisorDetails, setAdvisorDetails] = 
		useState<Map<string, AdvisorRecItemDetail>>(
			new Map<string, AdvisorRecItemDetail>());
	// New state for controlling the visibility of the next button
	const [showNextButton, setShowNextButton] = useState(true);

		// Fetch the recommendations from the server
	// FIXME: abstract this into the studyApi
	useEffect(() => {
		const getRecommendations = async () => {
			setLoading(true);
			const requestObj = {
				user_id: participant.id,
				user_condition: participant.condition_id,
				ratings: [...ratedMovies.current.values()].map(rating => {
					return {
						movie_id: rating.movielens_id,
						rating: rating.rating
					}
				})
			}
			console.log("PreferenceVisualization getRecommendations", requestObj, participant);
			studyApi.post<AdvisorRequestObj, AdvisorRecItemDetail[]>("prefcommURL", {
				user_id: participant.id,
				user_condition: participant.condition_id,
				ratings: [...ratedMovies.current.values()].map(rating => {
					return {
						item_id: rating.movielens_id,
						rating: rating.rating
					}
				})
			}).then((responseItems: AdvisorRecItemDetail[]) => {
				console.log("PreferenceVisualization newstuff", responseItems);
				let itemMap = new Map<string, AdvisorRecItemDetail>();
				for (let item of responseItems) {
					itemMap.set(item.id, item);
				}
				setAdvisorDetails(itemMap);
				setLoading(false);
			}).catch((err: any) => {
				console.log("VisualizationLayout Error", err);
			});
		}

		if (advisorDetails.size === 0 && participant.id !== '' && participant.condition_id !== '') {
			getRecommendations();
		}

	}, [ratedMovies, advisorDetails, studyApi, participant]);

	// useEffect(() => {
	// 	getNextStudyStep(userdata.study_id, stepid)
	// 		.then((value) => {
	// 			setStudyStep(value);
	// 			fetchRecommendations();
	// 		});
	// }, [userdata.study_id, stepid]);

	// const fetchRecommendations = () => {
	// 	const ratedMoviesData = state ? state.ratings : [];
	// 	const recType = state ? state.recType : 0;

	// 	const formattedRatings = ratedMoviesData.map(rating => ({
	// 		item_id: rating.movie_id || rating.item_id,
	// 		rating: rating.rating
	// 	}));

	// 	console.log("Payload:", {
	// 		ratings: formattedRatings,
	// 		rec_type: recType,
	// 		num_rec: 7,
	// 		user_id: userdata.id
	// 	});

	// 	if (formattedRatings.length > 0) {
	// 		post('prefComm/advisors/', {
	// 			ratings: formattedRatings,
	// 			rec_type: recType,
	// 			num_rec: 7,
	// 			user_id: userdata.id
	// 		})
	// 			.then(response => response.json())
	// 			.then(advisors => {
	// 				setRecommendations(advisors);
	// 				setLoading(false);
	// 				sendLog(userdata, studyStep.id, null, new Date() - starttime,
	// 					'advisors_loaded', 'fetch', null, null);
	// 			})
	// 			.catch(error => {
	// 				console.log("Error:", error);
	// 				setLoading(false);
	// 			});
	// 	} else {
	// 		console.log("No ratings available");
	// 		setLoading(false);
	// 	}
	// };

	// const handleAdvisorSelection = (advisorId) => {
	// 	sendLog(userdata, studyStep.id, null, new Date() - starttime,
	// 		'advisor_selected', 'select', advisorId, null);
	// };

	// const handleAdvisorRating = (advisorId, rating) => {
	// 	sendLog(userdata, studyStep.id, null, new Date() - starttime,
	// 		'advisor_rated', 'rate', advisorId, rating);
	// };

	// const handleNextStep = () => {
	// 	// sendLog(userdata, studyStep.id, null, new Date() - starttime,
	// 	// 	'advisors_complete', 'next', null, null);
	// 	navigate(props.next, { state: { user: userdata, studyStep: studyStep.id } });
	// };

	return (
		<>
			{loading || advisorDetails.size === 0 ?
				<LoadingScreen
					loading={loading || advisorDetails.size === 0}
					message={'Please wait while the system prepares your recommendations'}
					byline={"This may take a while."}
				/>
				:
				<Container className="Main-content">
					<AdvisorsWidget
						currentAdvisors={advisorDetails}
					/>
					{showNextButton && (
						<div className="jumbotron jumbotron-footer">
							<NextButton
								disabled={false}
								loading={false}
								onClick={handleNextBtn}
							/>
						</div>
					)}
				</Container>
			}
		</>
	)
}

export default AdvisorsPage;