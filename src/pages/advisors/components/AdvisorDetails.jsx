import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import { imgurl, post } from "../../../middleware/requests";

const AdvisorDetails = ({ advisor, acceptCallback, rejectCallback, formData}) => {
  const [advisorProfile, setAdvisorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showAdvisorProfile, setShowAdvisorProfile] = useState(false);
  const [advisorName, setAdvisorName] = useState("Advisor Name"); //Placeholder for advisor name
  const [recommendationSubmitted, setRecommendationSubmitted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rationale, setRationale] = useState("");

  useEffect(() => {
    if (advisor) {
       setButtonDisabled(advisor.status.toLowerCase() !== "pending");

       // Fetch initial profile data
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


  const advisorProfileLabels = (key, value, isSubmitted) => {
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
  };

  if (!advisor) {
    return (
      <div style={{ border: "2px solid" }}>
        <h2>Advisor Details</h2>
      </div>
    );
  }

  return (
    <Container style={{ border: "2px solid" }}>
      {loading ? (
        <div>Loading advisor details...</div>
      ) : (
        <>
          {showAdvisorProfile && advisorProfile && (
            <Row>
              <Col>
                <div className="profile-heading">
                  {/* the image url is a placeholder for now */}
                  <img className="profImg" src={imgurl(advisor.poster_identifier)} alt="profile description" />
                  <p className="profHead">{advisorName}</p>
                </div>
              </Col>
            </Row>
          )}
          { showAdvisorProfile && advisorProfile && (
            <Row style={{border: "2px solid"}}>
              <Col>
                <ul>
                  {Object.entries(advisorProfile.profile).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="AdvisorProfile-list-item"
                      >
                        <p>{parse(advisorProfileLabels(key, value))}</p>
                      </li>
                    )
                  )}
                </ul>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <h2>Advisor Details</h2>
              <Row style={{ border: "1px solid" }}>
                <div>
                  <Row style={{ border: "1px solid" }}>
                    <Image
                      className="AdvisorsDetails-poster"
                      src={imgurl(advisor.poster_identifier)}
                      alt={advisor.name}
                    />
                  </Row>
                </div>
              </Row>
            </Col>
          </Row>
          {showRating ? (
            <Row style={{ border: "1px solid" }}>
              <Col>
                <h2>Your Recommendation to {advisorName}</h2>
                <p> {rationale}</p>
              </Col>
            </Row>
          ) : console.log(formData)}
        </>
      )}
    </Container>
  );
};

export default AdvisorDetails;
