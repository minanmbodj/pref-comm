import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { get, post, getNextStudyStep, sendLog, updateSeen } from '../../middleware/api-middleware';
import MovieGrid from './components/MovieGrid';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { useNavigate } from 'react-router-dom';

export default function MovieRatingPage(props) {
	const itemsPerPage = 24;

	const navigate = useNavigate();

	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);
	const [movies, setMovies] = useState([]);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);


	const [movieIds, setMovieIds] = useState([]);

	const [moviesToFetch, setMoviesToFetch] = useState([]);

	const [studyStep, setStudyStep] = useState(props.studyStep);
	useEffect(() => { setStudyStep(props.studyStep) }, [props.studyStep]);


	function handleNavigate(recType, ratedMoviesData, next) {
		navigate(next,
			{ state: { recType: recType, ratings: ratedMoviesData } });
	}


	const rateMoviesHandler = (newRating, idstr) => {
		const movieid = parseInt(idstr);
		const isNew = !ratedMoviesData.some(item =>
			item.item_id === movieid);

		let newrefMovies = [...movies];
		let newrefRatedMovies = [...ratedMovies];
		let newrefRatedMoviesData = [...ratedMoviesData];

		let updatedmovie = newrefMovies.find(item => item.movie_id === movieid);
		updatedmovie.rating = newRating;
		if (isNew) {
			let updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
			let updaterated = [...ratedMovies, updatedmovie];
			setRatedMovies(updaterated);
			setRatedMoviesData(updatevisited);
			setRatedMovieCount(updatevisited.length);
			setButtonDisabled(updatevisited.length < 10);
		} else {
			let updatevisited = newrefRatedMoviesData.find(item => item.item_id === movieid);
			updatevisited.rating = newRating;

			let updaterated = newrefRatedMovies.find(item => item.movie_id === movieid);
			updaterated.rating = newRating;
			setRatedMovies(newrefRatedMovies);
			setRatedMoviesData(newrefRatedMoviesData);
		}
		setMovies(newrefMovies);
	}
	const pickRandomMovies = () => {
		const limit = itemsPerPage * 2;
		let randomMovies = [];
		let moviearr = [...movieIds];
		for (let i = 0; i < limit; i++) {
			let randomMovie = moviearr.splice(Math.floor(Math.random()
				* moviearr.length), 1);
			randomMovies.push(...randomMovie);
		}
		setMovieIds(moviearr);
		setMoviesToFetch(randomMovies);
	}

	useEffect(() => {
		const limit = itemsPerPage * 2;
		let moviearr = [...movieIds];
		let randomMovies = [];
		for (let i = 0; i < limit; i++) {
			let randomMovie = moviearr.splice(Math.floor(Math.random()
				* moviearr.length), 1);
			randomMovies.push(...randomMovie);
		}
		setMoviesToFetch(randomMovies);
	}, [movieIds]);

	useEffect(() => {
		const getMoviesByIDs = async (ids) => {
			console.log(ids);
			post('ers/movies/', ids)
				.then((response): Promise<movie[]> => response.json())
				.then((newmovies: movie[]) => {
					console.log(newmovies);
					setMovies((prevMovies) => [...prevMovies, ...newmovies]);
				})
				.catch((error) => console.log(error));
		}
		getMoviesByIDs(moviesToFetch);

	}, [moviesToFetch]);

	useEffect(() => {
		const getAllMovieIds = async () => {
			get('ers/movies/ids/')
				.then((response): Promise<movie[]> => response.json())
				.then((newmovies: movie[]) => {
					console.log(newmovies);
					setMovieIds(newmovies);

				})
				.catch((error) => console.log(error));
		}
		getAllMovieIds();
	}, []);

	const submitHandler = (recType) => {
		setLoading(true);

		if (ratedMovies.length > 0) {
			handleNavigate(recType, ratedMoviesData, '/advisors');
		}
	}

	const updateCurrentPage = (page) => {
		const currentpage = currentPage;
		let action = 'next';
		if (currentpage > page) {
			action = 'prev';
		}
		setCurrentPage(page);
	}

	const loadingMsg = 'Please wait while the system ' +
		'prepares your recommendations'

	return (
		<>
			{loading ?
				<LoadingScreen loading={loading} loadingMessage={loadingMsg} />
				:
				<Container>
					<Row>
						<MovieGrid ratingCallback={rateMoviesHandler}
							movies={movies}
							pagingCallback={updateCurrentPage}
							itemsPerPage={itemsPerPage}
							dataCallback={pickRandomMovies} />
					</Row>
					<Row>
						<div className="jumbotron jumbotron-footer"
							style={{ display: "flex" }}>
							<RankHolder count={ratedMovieCount} />
							<NextButton disabled={buttonDisabled && !loading}
								loading={loading}
								onClick={() => submitHandler(0)} />
						</div>
					</Row>
				</Container>
			}
		</>
	);
}

const RankHolder = (props) => {
	return (
		<div className="rankHolder">
			<span> Ranked Movies: </span>
			<span><i>{props.count}</i></span>
			<span><i>of {10}</i></span>
		</div>
	)
}


export const LoadingScreen = ({ loading, loadingMessage, loadingByline }) => {

	return (
		<>
			{loading &&
				<div style={{
					position: "absolute", width: "100%",
					height: "100%", zIndex: "999",
					backgroundColor: "rgba(255, 255, 255, 1)",
					margin: "18px auto auto auto"
				}}>
					<h2 style={{
						margin: "300px auto 3px auto",
						color: "black"
					}}>
						{loadingMessage}
						<div className="loaderStage">
							<div className="dot-floating" style={{
								margin: "1.5em auto"
							}}></div>
						</div>
					</h2>
					{loadingByline &&
						<p>{loadingByline}</p>
					}
				</div>
			}
		</>
	)
}

export const NextButton = ({ variant, disabled, loading, onClick }) => {

	variant = variant || "ers";

	return (
		<Button variant={variant} size="lg" className="nextButton footer-btn"
			disabled={disabled} onClick={onClick}>
			{!loading ? 'Next'
				:
				<>
					<Spinner
						as="span"
						animation="grow"
						size="sm"
						role="status"
						aria-hidden="true"
					/>
					Loading...
				</>
			}
		</Button>
	)
}