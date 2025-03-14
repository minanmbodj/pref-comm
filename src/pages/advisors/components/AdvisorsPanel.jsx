import React from 'react';
import { Image } from 'react-bootstrap';
import './css/AdvisorsPanel.css';

export default function AdvisorsPanel({ activeSelection, advisors, selectCallback, getAdvisorName }) {

  return (
    <div className="advisors-panel-container">
      <h2>Your Advisors</h2>
      <div className="advisors-list">
        {Array.from(advisors.entries()).map(([advisorId, advisor]) => (
          <AdvisorListItem
            key={`advisor-${advisor.id}`}
            advisor={advisor}
            anonymousName={`advisor-${advisor.id}`}
            selected={advisor.id === activeSelection}
            selectCallback={selectCallback}
          />
        ))}
      </div>
    </div>
  );
}

const AdvisorListItem = ({ advisor, anonymousName, selected, selectCallback }) => {
  return (
    <div
      className={`advisor-item ${selected ? 'selected' : ''}`}
      onClick={() => selectCallback(advisor.id)}
    >
      <Image
        className="advisor-image"
        src={advisor.recommendation.poster}
        roundedCircle
      />
      <div className="advisor-info">
        <div className="advisor-name">{anonymousName}</div>
      </div>
    </div>
  );
}