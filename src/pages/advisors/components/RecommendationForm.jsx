import React, { useState } from "react";
import { Form, Button, Alert} from "react-bootstrap";

const RecommendationForm = ({ advisor, onSubmit }) => {
  const [movieName, setMovieName] = useState("");
  const [rating, setRating] = useState(3);
  const [rationale, setRationale] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [advisorName, setAdvisorName] = useState("Advisor Name"); //TODO: change when we get the advisors name

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
      <h5>Recommendation Form</h5>
      {isSubmitted  ? (
        <>
          <Alert variant="success">
           Your recommendation has been saved; thank you!
          </Alert>
        </>
      ) : (
        <div>
            
          <Form>
            <Form.Group controlId="recommendation">
              <Form.Label>Please input the movie you wish to recommend to {advisorName} and why.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Movie name ..."
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="rationale">
              {/* <Form.Label>
                In five sentences or less, explain why {advisorName} should watch
                the movie you have chosen.
              </Form.Label> */}
              <Form.Control
                as="textarea"
                rows={5}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}
            disabled={rationale === "" || movieName === ""}>
              Submit
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;
