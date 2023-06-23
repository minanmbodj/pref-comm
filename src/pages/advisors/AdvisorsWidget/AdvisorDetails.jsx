import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { default_movie_thumbnail } from "../../../constants/defaults";
import StarRatings from "react-star-ratings";

export default function AdvisorDetails(props) {
	const [advisor, setAdvisor] = useState(props.advisor);
	const [image, setImage] = useState(default_movie_thumbnail);
	useEffect(() => {
		setAdvisor(props.advisor);
		if (props.advisor) {
			props.advisor.Image && setImage(props.advisor.Image);
		}
	}, [props.advisor]);

	const [showRecommendationFormModal, setShowRecommendationFormModal] = useState(false);

	if (!advisor) return (
		<div style={{ border: "2px solid" }}>
			<h2>Advisor Details</h2>
		</div>
	)

	return (
		<Container style={{ border: "2px solid" }}>
			<UserRecommendationFormModal show={showRecommendationFormModal}
				handleClose={() => setShowRecommendationFormModal(false)}
				advisor={advisor} />
			<Row>
				<h2>Advisor Details</h2>
			</Row>
			<Row style={{ border: "1px solid" }}>
				<div>
					<Row style={{ border: "1px solid" }}>
						<Image className="AdvisorsDetails-poster"
							src={image} alt={advisor.name} />
					</Row>
					<Row style={{ border: "1px solid" }}>
						<h3>
							{advisor.name}'s recommended movie
						</h3>
					</Row>
					<Row style={{ border: "1px solid" }}>
						<p>
							{advisor.advice}
						</p>
					</Row>
					<Row style={{ border: "1px solid", padding: "10px" }}>
						<StarRatings
							rating={advisor.rating}
							starRatedColor="rgb(245, 202, 0)"
							starHoverColor="rgb(245, 202, 0)"
							starDimension="27px"
							starSpacing="3px"
							changeRating={props.ratingCallback}
							name={advisor.id}
							numberOfStars={5} />
					</Row>
					<Row className="AdvisorsDetails-button-panel" style={{ border: "1px solid" }}>
						<Col style={{ border: "1px solid" }}>
							<Button className="AdvisorsDetails-button-accept"
								variant="success"
								onClick={() => {
									setShowRecommendationFormModal(true);
								}}>
								Accept Recommendation
							</Button>
						</Col>
						<Col style={{ border: "1px solid" }}>
							<Button className="AdvisorsDetails-button-reject"
								variant="danger">
								Reject Recommendation
							</Button>
						</Col>
					</Row>
				</div>
			</Row>
		</Container>
	)
}

function UserRecommendationFormModal(props) {
	return (
		<Modal size="lg" centered
			show={props.show} onHide={() => { }}>
			<Modal.Header>
				<Modal.Title>Recommendation Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<h5>
						More about <span> {props.advisor.name}</span>
					</h5>
					<ul>
						{Object.entries(props.advisor.profile)
							.map(([key, value]) => {
								return (
									<li key={key}
										className="AdvisorProfile-list-item">
										<p style={{ margin: "auto 0" }}>
											{value}
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
						<Form.Select>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3" selected>3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Select>
					</Form.Group>
					<Form.Group controlId="rationale">
						<Form.Label style={{ marginTop: "10px" }}>
							In five sentences or less, explain why
							<span> {props.advisor.name}</span> should watch movie you have chosen.
						</Form.Label>
						<Form.Control as="textarea" rows={5} />
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				{/* <Button variant="secondary" onClick={props.handleClose}>
					Close
				</Button> */}
				<Button variant="primary" onClick={props.handleClose}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	)
}