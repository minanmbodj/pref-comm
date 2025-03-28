import React, { useCallback, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useLocation, useNavigate } from 'react-router-dom';
import {
	CurrentStep, isEmptyParticipant, Participant, StudyStep,
	useStudy
} from "rssa-api";
import Footer from "../../widgets/Footer";
import Header from "../../widgets/Header";
import LoadingScreen from '../../widgets/loadingscreen/LoadingScreen';
import { Movie, MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import { StudyPageProps } from '../StudyPage.types';
import AdvisorsWidget from "./components/AdvisorsWidget";
import { AdvisorProfile } from "./Advisor.types";
import "./components/css/AdvisorsComponent.css";


type AdvisorRecItemDetail = {
	id: string; // This will likely be a UUID string
	// TODO: Add the rest of the fields by checking the API response
}

type AdvisorRequestObj = {
	// TODO: Add the rest of the fields by checking the API request
}

const AdvisorsPage: React.FC<StudyPageProps> = ({
	next,
	checkpointUrl,
	participant,
	studyStep,
	updateCallback,
	sizeWarning
}) => {

	const { studyApi } = useStudy();
	const navigate = useNavigate();
	const location = useLocation();

	const stateData = location.state as any;
	const [ratedMovies, setRatedMovies] = useState(new Map<number, MovieRating>());

	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const [advisorDetails, setAdvisorDetails] =
		useState<Map<number, AdvisorProfile>>(
			new Map<number, AdvisorProfile>());

	const [showNextButton, setShowNextButton] = useState(true);

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

	const getRecommendations = useCallback(
		(ratings: Map<number, MovieRating>, participant: Participant) => {
			setLoading(true);
			studyApi.post<AdvisorRequestObj,
				AdvisorProfile[]>("prefComm/advisors/", {
					user_id: participant.id,
					user_condition: participant.condition_id,
					ratings: [...ratings.values()].map(rating => {
						return {
							item_id: rating.movielens_id,
							rating: rating.rating
						}
					})
				}).then((responseItems: AdvisorProfile[]) => {
					let itemMap = new Map<number, AdvisorProfile>();
					Array.from(responseItems).forEach((item) => {
						let newItem = item;
						item.selected = false;
						item.responded = false;
						itemMap.set(item.id, newItem);
					});

					setAdvisorDetails(itemMap);
					setLoading(false);
				}).catch((err: any) => {
					console.log("Error", err);
				});
		}, [studyApi]);

	useEffect(() => {
		if (ratedMovies === undefined || ratedMovies.size === 0) {
			if (stateData && stateData.ratedMovies) {
				const ratedMoviesData = new Map<number, MovieRating>();
				for (let key in stateData.ratedMovies) {
					let moviedata = stateData.ratedMovies[key];
					ratedMoviesData.set(moviedata.movielens_id, moviedata);
				}
				setRatedMovies(ratedMoviesData);
			} else {
				const storedRatedMovies = localStorage.getItem('ratedMoviesData');
				if (storedRatedMovies) {
					const ratedMovieCache = JSON.parse(storedRatedMovies);
					const ratedMovieData = new Map<number, MovieRating>();
					for (let key in ratedMovieCache) {
						ratedMovieData.set(parseInt(key), ratedMovieCache[key]);
					}
					setRatedMovies(ratedMovieData);
				} else {
					console.error("Something went wrong with the rated movies");
					// TODO: Clear stored local data and redirect to start of study
				}
			}
		}
		if (advisorDetails.size === 0 &&
			!isEmptyParticipant(participant) &&
			ratedMovies.size > 0) {
			getRecommendations(ratedMovies, participant);
		}
	}, [ratedMovies, stateData, getRecommendations, advisorDetails, participant]);


	return (
		<Container>
			<Row>
				<Header title={studyStep?.name} content={studyStep?.description} />
			</Row>
			{loading || advisorDetails.size === 0 ?
				<LoadingScreen
					loading={loading || advisorDetails.size === 0}
					message={'Please wait while the system prepares your recommendations'}
					byline={"This may take a while."}
				/>
				:
				<AdvisorsWidget
					participantId={participant.id}
					currentAdvisors={advisorDetails}
				/>
			}
			<Row>
				<Footer callback={handleNextBtn} disabled={showNextButton} />
			</Row>
		</Container>
	)
}

export default AdvisorsPage;