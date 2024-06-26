import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import { imgurl, post } from "../../../middleware/requests";
import "./Recommendations.css";

const AdvisorDetails = ({ advisor, acceptCallback, rejectCallback }) => {
    const [advisorProfile, setAdvisorProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdvisorProfile, setShowAdvisorProfile] = useState(false);
    const [advisorName, setAdvisorName] = useState("Advisor Name"); //TODO: change when we get the advisors name

  useEffect(() => {
    if (advisor) {
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
    getAdvisorProfile(advisor.movie_id);
  };

  const handleReject = () => {
    rejectCallback(advisor.id);
    getAdvisorProfile(advisor.movie_id);
  };

  if (!advisor) {
    return (
      <div style={{ border: "2px solid" }}>
        <h2>Advisor Details</h2>
      </div>
    );
  }

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', border: "2px solid" }}>
      {loading ? (
        <div>Loading advisor details...</div>
      ) : (
        <>
        <Row style={{ border: "1px solid", flex: 1 }}>
            <h4>How do you feel about {advisorName}'s recommendation?</h4>
        </Row>
        <Row
            className="AdvisorsDetails-button-panel"
        >
            <Col className="button-container1">
                <Button
                className="AdvisorsDetails-button-accept"
                variant="success"
                onClick={handleAccept}
                >
                Accept Recommendation
                </Button>
            </Col>
            <Col className="button-container2">
                <Button
                className="AdvisorsDetails-button-reject"
                variant="danger"
                onClick={handleReject}
                >
                Reject Recommendation
                </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdvisorDetails;
