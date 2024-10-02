import React from 'react';
import { Image } from 'react-bootstrap';
import './AdvisorsPanel.css';

const anonymousAnimals = [
  'Alligator', 'Buffalo', 'Coyote',
  'Dolphin', 'Elephant', 'Frog', 'Giraffe'
];

export default function AdvisorsPanel({ activeSelection, advisors, selectCallback }) {
  return (
    <div className="advisors-panel-container">
      <h2>Your Advisors</h2>
      <div className="advisors-list">
        {advisors.map((advisor, index) => (
          <AdvisorListItem
            key={advisor.id}
            advisor={advisor}
            anonymousName={anonymousAnimals[index]}
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
        src={advisor.poster_identifier ? `https://rssa.recsys.dev/movie/poster/${advisor.poster_identifier}` : '/api/placeholder/60/60'}
        roundedCircle
      />
      <div className="advisor-info">
        <div className="advisor-anonymous">Anonymous</div>
        <div className="advisor-name">{anonymousName}</div>
      </div>
    </div>
  );
}