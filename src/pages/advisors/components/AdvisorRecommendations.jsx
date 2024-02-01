import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import { imgurl, post } from "../../../middleware/requests";

const AdvisorDetails = ({ advisor, acceptCallback, rejectCallback }) => {
    const [advisorProfile, setAdvisorProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdvisorProfile, setShowAdvisorProfile] = useState(false);

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
    <Container style={{ border: "2px solid" }}>
      {loading ? (
        <div>Loading advisor details...</div>
      ) : (
        <>
        <Row style={{ border: "1px solid" }}>
            <h3>Advisor is recommending "{advisor.name}"</h3>
        </Row>
        <Row
            className="AdvisorsDetails-button-panel"
            style={{ border: "1px solid" }}
        >
            <Col style={{ border: "1px solid" }}>
                <Button
                className="AdvisorsDetails-button-accept"
                variant="success"
                onClick={handleAccept}
                >
                Accept Recommendation
                </Button>
            </Col>
            <Col style={{ border: "1px solid" }}>
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
