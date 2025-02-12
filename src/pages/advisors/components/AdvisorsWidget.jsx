import React, { useState } from "react";
import AdvisorDetails from "./AdvisorDetails";
import AdvisorsPanel from "./AdvisorsPanel";
import RecommendationForm from "./RecommendationForm";
import AdvisorRecommendations from "./AdvisorRecommendations";
import { Col, Row } from "react-bootstrap";
import "./css/AdvisorsWidget.css";

const anonymousAnimals = [
  'Anonymous Alligator', 'Anonymous Buffalo', 'Anonymous Coyote',
  'Anonymous Dolphin', 'Anonymous Elephant', 'Anonymous Frog', 'Anonymous Giraffe'
];

function mapReplace(arr, prop, propval, callback) {
  return arr.map((item) => {
    if (item[prop] === propval) {
      return callback(item);
    } else {
      return item;
    }
  });
}

export default function AdvisorsWidget({ currentAdvisors }) {
  const [advisors, setAdvisors] = useState(currentAdvisors || []);
  const [activeSelection, setActiveSelection] = useState(null);
  const [approvalPressed, setApprovalPressed] = useState(false);
  const [formData, setFormData] = useState({});
  const [recommendationSubmitted, setRecommendationSubmitted] = useState(false);

  const getAdvisorName = (advisorId) => {
    return `${anonymousAnimals[(advisorId - 1) % anonymousAnimals.length]}`;
  };

  const handleSelect = (advisorId) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorId);
    setActiveSelection(selectedAdvisor);
    setApprovalPressed(false);
    setFormData({});
    setRecommendationSubmitted(false);
  };

  const handleRating = (rating, advisorId) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorId);
    selectedAdvisor.rating = rating;
    const newAdvisors = mapReplace(advisors, "id", advisorId, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleAccept = (advisorId) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorId);
    selectedAdvisor.status = "Accepted";
    setApprovalPressed(true);
    const newAdvisors = mapReplace(advisors, "id", advisorId, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleReject = (advisorId) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorId);
    selectedAdvisor.status = "Rejected";
    setApprovalPressed(true);
    const newAdvisors = mapReplace(advisors, "id", advisorId, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleRecommendationSubmit = (newFormData) => {
    setFormData(newFormData);
    setRecommendationSubmitted(true);
    console.log("Form data:", newFormData);
  };

  return (
    <Row className="advisors-widget-row">
      <Col xs={2} className="advisors-widget-column">
        <AdvisorsPanel
          advisors={advisors}
          activeSelection={activeSelection && activeSelection.id}
          selectCallback={handleSelect}
          getAdvisorName={getAdvisorName}
        />
      </Col>
      {activeSelection && (
        <Col xs={6} className="advisors-widget-column">
          <AdvisorDetails
            advisor={activeSelection}
            ratingCallback={handleRating}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
            advisorName={getAdvisorName(activeSelection.id)}
          />
        </Col>
      )}
      {activeSelection && (
      <Col xs={4} className="advisors-widget-column">
        {!approvalPressed && (
          <AdvisorRecommendations
            advisor={activeSelection}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
            advisorName={getAdvisorName(activeSelection.id)}
            formData={formData}
          />
        )}
        {approvalPressed && !recommendationSubmitted && (
          <RecommendationForm
            advisor={activeSelection}
            onSubmit={handleRecommendationSubmit}
            advisorName={getAdvisorName(activeSelection.id)}
          />
        )}
      </Col>
      )}
    </Row>
  );
}