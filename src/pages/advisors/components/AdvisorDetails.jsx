import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import parse from "html-react-parser";
import { imgurl, post } from "../../../middleware/requests";
import "./css/AdvisorDetails.css";

const AdvisorDetails = ({ advisor, acceptCallback, rejectCallback, formData, advisorName }) => {
  const [advisorProfile, setAdvisorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvisorProfile, setShowAdvisorProfile] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rationale, setRationale] = useState("");

  useEffect(() => {
    if (advisor) {
      getAdvisorProfile(advisor.movie_id);
    }
  }, [advisor]);

  const getAdvisorProfile = (advisor_id) => {
    setLoading(true);
    post("prefComm/advisor/profile/", { advisor_id })
      .then((response) => response.json())
      .then((advisor) => {
        setAdvisorProfile(advisor);
        setShowAdvisorProfile(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (formData) {
      setShowRating(formData.rating !== undefined);
      setRationale(formData.rationale);
    }
  }, [formData]);

  const advisorProfileLabels = (key, value) => {
    switch (key) {
      case "likes":
        return `<strong>The advisor likes</strong> ${value}`;
      case "dislikes":
        return `<strong>The advisor dislikes</strong> ${value}`;
      case "most_rated_genre":
        return `<strong>The advisor gave the highest rating to</strong> ${value.toLowerCase()} movies`;
      case "genretopten":
        return `<strong>Top ten movies rated highly by the advisor are</strong> ${value.toLowerCase()} movies`;
      case "genre_with_least_rating":
        return `<strong>The advisor's lowest rated movie was a${['a', 'e', 'i', 'o', 'u'].includes(value[0].toLowerCase()) ? 'n' : ''}</strong> ${value.toLowerCase()} movie`;
      default:
        return `The advisor's ${key} is ${value}`;
    }
  };

  return (
    <Container className="advisor-details-container">
      <Row className="advisor-details-header">
        <Col>
          <h4>{advisorName}'s Profile</h4>
        </Col>
      </Row>
      <Row className="advisor-details-content">
        <Col>
          {loading ? (
            <div>Loading advisor details...</div>
          ) : (
            <>
              {showAdvisorProfile && advisorProfile && (
                <div className="advisor-profile box">
                  <div className="profile-heading">
                    <Image 
                      className="advisor-image" 
                      src={imgurl(advisor.poster_identifier)} 
                      alt="profile description" 
                      roundedCircle
                    />
                    <h5>{advisorName}</h5>
                  </div>
                  <div className="profile-details">
                    <h6 className="section-title">Profile Details</h6>
                    <ul className="profile-list">
                      {Object.entries(advisorProfile.profile).map(([key, value]) => (
                        <li key={key} className="profile-item">
                          {parse(advisorProfileLabels(key, value))}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="recommendation-section box">
                <h6 className="section-title">{advisorName}'s Recommendation to You</h6>
                <div className="recommendation-content">
                  <Image
                    className="recommendation-poster"
                    src={imgurl(advisor.poster_identifier)}
                    alt={advisor.name}
                  />
                  <p className="recommendation-description">
                    Description of the advisor's recommendation to the user.
                    Will include extra details specified later on.
                  </p>
                </div>
              </div>
              {showRating && (
                <div className="user-recommendation box">
                  <h6 className="section-title">Your Recommendation to {advisorName}</h6>
                  <p>{rationale}</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdvisorDetails;