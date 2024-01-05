import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AdvisorDetails from "./AdvisorDetails";
import AdvisorsPanel from "./AdvisorsPanel";
import RecommendationForm from "./RecommendationForm";
import "./AdvisorsWidget.css";

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
  const [showRecommendationFormPanel, setShowRecommendationFormPanel] = useState(false);

  const handleSelect = (advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    setActiveSelection(selectedAdvisor);
    setShowRecommendationFormPanel(false); // Reset the state when selecting a new advisor
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
    setShowRecommendationFormPanel(true);
    const newAdvisors = mapReplace(advisors, "id", advisorid, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  const handleReject = (advisorid) => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === advisorid);
    selectedAdvisor.status = "Rejected";
    setShowRecommendationFormPanel(true);
    const newAdvisors = mapReplace(advisors, "id", advisorid, (advisor) => {
      return selectedAdvisor;
    });
    setAdvisors(newAdvisors);
  };

  return (
    <Row>
      <Col sm={4}>
        <AdvisorsPanel
          advisors={advisors}
          activeSelection={activeSelection && activeSelection.id}
          selectCallback={handleSelect}
        />
      </Col>
      <Col sm={4}>
        <AdvisorDetails
          advisor={activeSelection}
          ratingCallback={handleRating}
          acceptCallback={handleAccept}
          rejectCallback={handleReject}
        />
      </Col>
      <Col sm={4}>
  {showRecommendationFormPanel && activeSelection && (
    <RecommendationForm
      advisor={activeSelection}  // Pass the correct advisor prop
      onSubmit={(formData) => {
        // Handle form submission logic here
        console.log("Form data:", formData);
      }}
    />
  )}
</Col>
    </Row>
  );
}
