import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import StarRatings from "react-star-ratings";
import { imgurl, post } from "../../../middleware/requests";

export default function AdvisorDetails({ advisor, acceptCallback, rejectCallback }) {
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [advisorProfile, setAdvisorProfile] = useState(undefined);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (advisor) {
			setButtonDisabled(advisor.status.toLowerCase() !== "pending");
		}
	}, [advisor]);

	const [showRecommendationFormModal, setShowRecommendationFormModal] =
		useState(false);

	const getAdvisorProfile = (advisor_id) => {
		if (advisorProfile === undefined) {
			setLoading(true);
			post('prefComm/advisor/profile/', {
				advisor_id: advisor_id
			})
				.then((response): Promise<movie[]> => response.json())
				.then((advisor: advisor) => {
					setAdvisorProfile(advisor);
					// setLoading(false);
					console.log("advisorDeets", advisor);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		}
	}

	useEffect(() => {
		if (advisorProfile) {
			setLoading(false);
			setShowRecommendationFormModal(true);
		}
	}, [advisorProfile]);

	const handleAccept = () => {
		acceptCallback(advisor.id);
		setButtonDisabled(advisor.status.toLowerCase() !== "pending");
		getAdvisorProfile(advisor.movie_id);
	}

	const handleReject = () => {
		rejectCallback(advisor.id);
		setButtonDisabled(advisor.status.toLowerCase() !== "pending");
		getAdvisorProfile(advisor.movie_id);
		// setShowRecommendationFormModal(true);
	}

	if (!advisor) return (
		<div style={{ border: "2px solid" }}>
			<h2>Advisor Details</h2>
		</div>
	)

	const submitHandler = () => {
		setAdvisorProfile(undefined);
		setShowRecommendationFormModal(false);
	}

	const handleClose = () => {
		setAdvisorProfile(undefined);
		setShowRecommendationFormModal(false);
	}

	return (
		<Container style={{ border: "2px solid" }}>
			<LoaderDialog show={loading} />
			<UserRecommendationFormModal show={showRecommendationFormModal}
				handleClose={handleClose}
				handleSubmit={submitHandler}
				advisor={advisorProfile} />
			<Row>
				<h2>Advisor Details</h2>
			</Row>
			<Row style={{ border: "1px solid" }}>
				<div>
					<Row style={{ border: "1px solid" }}>
						<Image className="AdvisorsDetails-poster"
							src={imgurl(advisor.poster_identifier)} alt={advisor.name} />
					</Row>
					<Row style={{ border: "1px solid" }}>
						<h3>
							Advisor is recommending "{advisor.name}"
						</h3>
					</Row>
					<Row style={{ border: "1px solid" }}>
						<h5>About the movie</h5>
						<p>
							{advisor.description}
						</p>
					</Row>
					<Row style={{ border: "1px solid", padding: "10px" }}>
						<StarRatings
							rating={advisor.ave_rating / 2}
							starRatedColor="rgb(245, 202, 0)"
							starHoverColor="rgb(245, 202, 0)"
							starDimension="27px"
							starSpacing="3px"
							numberOfStars={5} />
					</Row>
					<Row className="AdvisorsDetails-button-panel" style={{ border: "1px solid" }}>
						<Col style={{ border: "1px solid" }}>
							<Button className="AdvisorsDetails-button-accept"
								variant="success"
								disabled={buttonDisabled}
								onClick={() => {
									handleAccept();
								}}>
								Accept Recommendation
							</Button>
						</Col>
						<Col style={{ border: "1px solid" }}>
							<Button className="AdvisorsDetails-button-reject"
								variant="danger"
								disabled={buttonDisabled}
								onClick={() => {
									handleReject();
								}}>
								Reject Recommendation
							</Button>
						</Col>
					</Row>
				</div>
			</Row>
		</Container>
	)
}

const advisorProfileLabels = (key, value) => {
	switch (key) {
		case "likes":
			return `<strong>The advisor likes</strong> ${value}`;
		case "dislikes":
			return `<strong>The advisor dislikes</strong> ${value}`;
		case "most_rated_genre":
			return `<strong>The advisor gave the highest rating to</strong> 
			${value.toLowerCase()} movies`;
		case "genretopten":
			return `<strong>Top ten movies rated highly by the advisor 
			are</strong> ${value.toLowerCase()} movies`;
		case "genre_with_least_rating":
			return `<strong>The advisor's lowest rated movie was 
				a${['a', 'e', 'i', 'o', 'u'].includes(value[0].toLowerCase()) ?
					'n' : ''}</strong> ${value.toLowerCase()} movie`;
		default:
			return `The advisor's ${key} is ${value}`;
	}
}

const LoaderDialog = ({ show }) => {
	return (
		<Modal size="lg" centered
			show={show} onHide={() => { }}>
			<Modal.Header>
				<Modal.Title>Recommendation Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Spinner animation="border" role="status" />
				<p>
					Loading advisor details ...
				</p>
			</Modal.Body>
		</Modal>
	)
}

const UserRecommendationFormModal = ({ show, advisor, handleClose, handleSubmit }) => {
	return (
		<Modal size="lg" centered
			show={show} onHide={handleClose}>
			<Modal.Header>
				<Modal.Title>Recommendation Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{advisor === undefined ?
					<>
						<Spinner animation="border" role="status" />
						<p>
							Loading advisor details ...
						</p>
					</>
					:
					<>
						<Row>
							<h5>More about the advisor</h5>
							<ul>
								{Object.entries(advisor.profile)
									.map(([key, value]) => {
										return (
											<li key={key}
												className="AdvisorProfile-list-item">
												<p>
													{parse(advisorProfileLabels(key, value))}
												</p>
											</li>
										)
									})
								}
							</ul>
						</Row>
						<Form>
							<Form.Group controlId="recommendation">
								<Form.Label>
									What do you recommend for the advisor?
								</Form.Label>
								<Form.Control
									placeholder="Movie name ..."
									autoFocus />
							</Form.Group>
							<Form.Group controlId="rating">
								<Form.Label style={{ marginTop: "10px" }}>
									How would you rate the advice?
								</Form.Label>
								<Form.Select defaultValue={3}>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</Form.Select>
							</Form.Group>
							<Form.Group controlId="rationale">
								<Form.Label style={{ marginTop: "10px" }}>
									In five sentences or less, explain why
									<span> {advisor.name}</span> should watch movie you have chosen.
								</Form.Label>
								<Form.Control as="textarea" rows={5} />
							</Form.Group>
						</Form>
					</>
				}
			</Modal.Body>
			<Modal.Footer>
				{/* <Button variant="secondary" onClick={props.handleClose}>
					Close
				</Button> */}
				<Button variant="primary" onClick={handleSubmit}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	)
}