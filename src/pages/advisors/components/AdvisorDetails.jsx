import { useState } from "react";
import { Container, Image, Row } from "react-bootstrap";

const AdvisorDetails = ({ advisor, avatar }) => {
	const [loading, setLoading] = useState(false);

	return (
		<Container className="advisor-details-container">
			<Row className="advisor-details-header">
				<h4>{avatar.name}'s Profile</h4>
			</Row>
			<Row className="advisor-details-content">
				{loading ? (
					<div>Loading advisor details...</div>
				) : (
					<>
						<div className="advisor-profile box">
							<div className="profile-heading">
								<Image
									className="advisor-image-about"
									src={avatar.src}
									alt={avatar.alt}
									roundedCircle
								/>
							</div>
							<div className="profile-details">
								<h6 className="section-title">Top movies</h6>
								<ul className="profile-list">
									{Array.from(advisor.movies).map((movie, idx) => (
										<li key={`{advisorName}-movies-${idx}`} className="profile-item">
											<Image
												className="advisor-image-about"
												src={movie.poster}
												alt="profile description"
											/>
											<p>{movie.title}</p>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="recommendation-section box">
							<h6 className="section-title">{avatar.name}'s Recommendation to You</h6>
							<div className="recommendation-content">
								<Image
									className="recommendation-poster"
									src={advisor.recommendation.poster}
									alt={`${advisor.name} recommendation: ${advisor.recommendation.formal}`}
								/>
								<p className="recommendation-description">
									{advisor.recommendation.formal}
								</p>
							</div>
						</div>
					</>
				)}
			</Row>
		</Container>
	);
};

export default AdvisorDetails;