import React, { useState } from "react";
import AdvisorDetails from "./AdvisorDetails";
import AdvisorsPanel from "./AdvisorsPanel";
import RecommendationForm from "./RecommendationForm";
import AdvisorRecommendations from "./AdvisorRecommendations";
import { Col, Row } from "react-bootstrap";
import "./AdvisorsWidget.css";

const anonymousAnimals = [
  'Alligator', 'Buffalo', 'Coyote',
  'Dolphin', 'Elephant', 'Frog', 'Giraffe'
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

  const getAdvisorName = (advisorId) => {
    return `${anonymousAnimals[advisorId % anonymousAnimals.length]}`;
  };

  const handleSelect = (advisorId) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorId);
    setActiveSelection(selectedAdvisor);
    setApprovalPressed(false);
    setFormData({});
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
        <Col xs={8} className="advisors-widget-column">
          <AdvisorDetails
            advisor={activeSelection}
            ratingCallback={handleRating}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
            formData={formData}
            advisorName={getAdvisorName(activeSelection.id)}
          />
        </Col>
      )}
      {activeSelection && (
      <Col xs={2} className="advisors-widget-column">
        {!approvalPressed && (
          <AdvisorRecommendations
            advisor={activeSelection}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
            advisorName={getAdvisorName(activeSelection.id)}
          />
        )}
        {approvalPressed && (
          <RecommendationForm
            advisor={activeSelection}
            onSubmit={(newFormData) => {
              setFormData(newFormData);
              console.log("Form data:", formData);
            }}
            advisorName={getAdvisorName(activeSelection.id)}
          />
        )}
      </Col>
      )}
    </Row>
  );
}