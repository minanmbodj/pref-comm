import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import "./Recommendations.css";

const RecommendationForm = ({ advisor, onSubmit, advisorName }) => {
  const [movieName, setMovieName] = useState("");
  const [rationale, setRationale] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      movieName,
      rationale,
    });
    setIsSubmitted(true);
  };

  return (
    <Container className="recommendation-form-container">
      <Row className="recommendation-form-header">
        <Col>
          <h4>Recommendation</h4>
        </Col>
      </Row>
      <Row className="recommendation-form-content">
        <Col className="d-flex flex-column h-100">
          {isSubmitted ? (
            <Alert variant="success" className="success-message">
              Your recommendation has been saved; thank you!
            </Alert>
          ) : (
            <Form className="d-flex flex-column h-100">
              <Form.Group className="mb-3" controlId="movieName">
                <Form.Label>Recommend a movie to {advisorName}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter movie name"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 flex-grow-1 d-flex flex-column" controlId="rationale">
                <Form.Label>
                  Why do you recommend this movie to {advisorName}?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="flex-grow-1"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Enter your rationale"
                />
              </Form.Group>
              <Button 
                className="submit-btn mt-auto" 
                variant="primary" 
                onClick={handleSubmit}
                disabled={rationale === "" || movieName === ""}
              >
                Submit
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendationForm;