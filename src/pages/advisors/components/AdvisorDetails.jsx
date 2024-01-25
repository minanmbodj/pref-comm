import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import { imgurl, post } from "../../../middleware/requests";

const AdvisorDetails = ({ advisor, acceptCallback, rejectCallback }) => {
  const [advisorProfile, setAdvisorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showAdvisorProfile, setShowAdvisorProfile] = useState(false);
  const [buttonsHidden, setButtonsHidden] = useState(false); // New state variable

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

  const handleAccept = () => {
    acceptCallback(advisor.id);
    setButtonDisabled(advisor.status.toLowerCase() !== "pending");
	setButtonDisabled(true);
    getAdvisorProfile(advisor.movie_id);
	setButtonsHidden(true); // Set buttonsHidden to true when accept is clicked
  };

  const handleReject = () => {
    rejectCallback(advisor.id);
    setButtonDisabled(advisor.status.toLowerCase() !== "pending");
	setButtonDisabled(true);
    getAdvisorProfile(advisor.movie_id);
	setButtonsHidden(true); // Set buttonsHidden to true when accept is clicked
  };


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
                  <Row style={{ border: "1px solid" }}>
                    <h3>Advisor is recommending "{advisor.name}"</h3>
                  </Row>
                  <Row
                    className="AdvisorsDetails-button-panel"
                    style={{ border: "1px solid" }}
                  >
                    {!buttonsHidden && ( // Conditionally render buttons
                      <>
                        <Col style={{ border: "1px solid" }}>
                          <Button
                            className="AdvisorsDetails-button-accept"
                            variant="success"
                            disabled={buttonDisabled}
                            onClick={handleAccept}
                          >
                            Accept Recommendation
                          </Button>
                        </Col>
                        <Col style={{ border: "1px solid" }}>
                          <Button
                            className="AdvisorsDetails-button-reject"
                            variant="danger"
                            disabled={buttonDisabled}
                            onClick={handleReject}
                          >
                            Reject Recommendation
                          </Button>
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdvisorDetails;
