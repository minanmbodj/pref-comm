import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Recommendations.css";

const AdvisorRecommendations = ({ advisor, acceptCallback, rejectCallback, advisorName }) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleAccept = () => {
    setSelectedButton('accept');
    acceptCallback(advisor.id);
  };

  const handleReject = () => {
    setSelectedButton('reject');
    rejectCallback(advisor.id);
  };

  return (
    <Container className="advisor-recommendations-container">
      <Row className="advisor-recommendations-header">
        <Col>
          <h4>Recommendations</h4>
        </Col>
      </Row>
      <Row className="advisor-recommendations-content">
        <Col className="content-wrapper">
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
        </Col>
      </Row>
    </Container>
  );
};

export default AdvisorRecommendations;