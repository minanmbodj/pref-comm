import React, { useState } from "react";
import { Form, Button, Alert} from "react-bootstrap";

const RecommendationForm = ({ advisor, onSubmit }) => {
  const [movieName, setMovieName] = useState("");
  const [rating, setRating] = useState(3);
  const [rationale, setRationale] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Add any additional validation or processing logic here
    // Then call onSubmit with the form data
    onSubmit({
      movieName,
      rating,
      rationale,
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    // Reset form state and submission status
    setMovieName("");
    setRating(3);
    setRationale("");
    setIsSubmitted(false);
  };

  return (
    <div>
      {!isSubmitted && (
        <div>
          <h5>Recommendation Form</h5>
          <Form>
            <Form.Group controlId="recommendation">
              <Form.Label>What do you recommend for the advisor?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Movie name ..."
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;
