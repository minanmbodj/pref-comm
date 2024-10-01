import { useState } from "react";
import AdvisorDetails from "./AdvisorDetails";
import AdvisorsPanel from "./AdvisorsPanel";
import RecommendationForm from "./RecommendationForm";
import AdvisorRecommendations from "./AdvisorRecommendations";
import "./AdvisorsWidget.css";
import {Button, Col, Row} from "react-bootstrap";

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
  //TODO: set the advisor name here eventually

  const handleSelect = (advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    setActiveSelection(selectedAdvisor);
    setApprovalPressed(false); // Reset the state when selecting a new advisor
    setFormData({}); // Reset the form data when selecting a new advisor
  };

  const handleRating = (rating, advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    selectedAdvisor.rating = rating;
    const newAdvisors = mapReplace(advisors, "id", advisorid, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleAccept = (advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    selectedAdvisor.status = "Accepted";
    setApprovalPressed(true);
    const newAdvisors = mapReplace(advisors, "id", advisorid, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleReject = (advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    selectedAdvisor.status = "Rejected";
    setApprovalPressed(true);
    const newAdvisors = mapReplace(advisors, "id", advisorid, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  return (
    <Row style={{ display: 'flex', height: '100%' }}>
      <Col xs={3} style={{ height: '100%', paddingRight: 0 }}>
        <AdvisorsPanel
          advisors={advisors}
          activeSelection={activeSelection && activeSelection.id}
          selectCallback={handleSelect}
        />
      </Col>
      {activeSelection && (
        <Col style={{ display: 'flex', flex: 3.5}}>
          <AdvisorDetails
            advisor={activeSelection}
            ratingCallback={handleRating}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
            formData={formData}
          />
        </Col>
      )}
      {activeSelection && (
      <Col style={{ display: 'flex', flex: 1}}>
        {!approvalPressed && (
          <AdvisorRecommendations
            advisor={activeSelection}
            acceptCallback={handleAccept}
            rejectCallback={handleReject}
          />
        )}
        {approvalPressed && (
          <RecommendationForm
            advisor={activeSelection}  // Pass the correct advisor prop
            onSubmit={(newFormData) => {
              setFormData(newFormData);
              // Handle form submission logic here
              console.log("Form data:", formData);
            }}
          />
        )}
      </Col>
      )}
    </Row>
  );
}
