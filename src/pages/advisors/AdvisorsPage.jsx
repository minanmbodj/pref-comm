import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import { post } from "../../middleware/requests";
import { LoadingScreen } from "../ratemovies/MovieRatingPage";
import AdvisorsWidget from "./components/AdvisorsWidget";
import '../ratemovies/components/MovieGrid.css';

export default function AdvisorsPage(props) {

	const state = useLocation().state;
	const [loading, setLoading] = useState(true);
	const [recommendations, setRecommendations] = useState([]);

	useEffect(() => {
		const ratedMoviesData = state ? state.ratings : [];
		const recType = state ? state.recType : 0;
		if (ratedMoviesData.length > 0) {
			post('prefComm/advisors/', {
				ratings: ratedMoviesData,
				rec_type: recType,
				num_rec: 7,
				user_id: 1
			})
				.then((response): Promise<movie[]> => response.json())
				.then((advisors: advisor[]) => {
					setRecommendations(advisors);
					setLoading(false);
					console.log("advisors", advisors);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		}
	}, [state]);

	useEffect(() => {
		console.log("recommendations", recommendations);
	}, [recommendations]);

	return (
		<>
			{loading || recommendations.length === 0 ?
				<LoadingScreen loading={loading || recommendations.length === 0}
					loadingMessage={'Please wait while the system prepares your recommendations'}
					loadingByline={"This may take a while."} />
				:
				<Container className="Main-content">	
					<AdvisorsWidget currentAdvisors={recommendations} />
				</Container>
			}
		</>
	)
}
