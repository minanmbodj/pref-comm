import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./css/Recommendations.css";

const AdvisorRecommendations = ({ advisor, acceptCallback, rejectCallback, advisorName, formData }) => {
  // console.log("Formdata: ", formData);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  const handleAccept = () => {
    setSelectedButton('accept');
    acceptCallback(advisor.id);
  };

  const handleReject = () => {
    setSelectedButton('reject');
    rejectCallback(advisor.id);
  };

  // Check if the recommendation form has been submitted
  React.useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setIsFormSubmitted(true);
    }
  }, [formData]);

  return (
    <Container className="advisor-recommendations-container">
      <Row className="advisor-recommendations-header">
        <Col>
          <h4>Recommendations</h4>
        </Col>
      </Row>
      <Row className="advisor-recommendations-content">
        <Col className="content-wrapper">
          {!isFormSubmitted ? (
            <div className="centered-content">
              <div className="question-container">
                <p>How do you feel about {advisorName}'s recommendation?</p>
              </div>
              <div className="buttons-container">
                <Button
                  className={`recommendation-button accept-button ${selectedButton === 'accept' ? 'selected' : ''}`}
                  onClick={handleAccept}
                >
                  Accept Recommendation
                </Button>
                <Button
                  className={`recommendation-button reject-button ${selectedButton === 'reject' ? 'selected' : ''}`}
                  onClick={handleReject}
                >
                  Reject Recommendation
                </Button>
              </div>
            </div>
          ) : (
            <div className="recommendation-results">
              <div className="thank-you-box">
                <p>Thank you for your feedback!</p>
              </div>
              <h5>Your Recommendation to {advisorName}</h5>
              <p><strong>Movie:</strong> {formData.movieName}</p>
              <p><strong>Rationale:</strong> {formData.rationale}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdvisorRecommendations;