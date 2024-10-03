import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNextStudyStep, sendLog, submitDemographicInfo } from '../../middleware/api-middleware';
import HeaderJumbotron from '../../widgets/headerJumbotron';
import { CountryDropdown } from 'react-country-region-selector';
import './DemographicsPage.css';

export default function DemographicsPage(props) {
  const userdata = useLocation().state.user;
  const stepid = useLocation().state.studyStep;
  const navigate = useNavigate();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selfDescribedGender, setSelfDescribedGender] = useState('');
  const [race, setRace] = useState([]);
  const [otherRace, setOtherRace] = useState('');
  const [education, setEducation] = useState('');
  const [country, setCountry] = useState('');
  const [studyStep, setStudyStep] = useState({});
  const [starttime] = useState(new Date());

  useEffect(() => {
    getNextStudyStep(userdata.study_id, stepid)
      .then((value) => { setStudyStep(value) });
  }, [userdata.study_id, stepid]);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendLog(userdata, studyStep.id, null, new Date() - starttime, 'demographics_submitted', 'submit', null, null);

    // const processedRace = race.includes('Not listed') ? [...race, otherRace] : race;
    // const processedGender = gender === 'Prefer to self-describe' ? selfDescribedGender : gender;

    // submitDemographicInfo(userdata, age, processedGender, education, country)
    //   .then(() => {
    navigate(props.next, { state: { user: userdata, studyStep: studyStep.id } });
    //   })
    //   .catch((error) => console.log(error));
  };

  return (
    <Container className="demographics-container">
      <HeaderJumbotron title="Demographics" content="Please provide the following demographic information." />
      <Form onSubmit={handleSubmit} className="demographics-form">
          <Form.Label>What is your age?</Form.Label>
          <Form.Control as="select" value={age} onChange={(e) => setAge(e.target.value)} required>
            <option value="">Select age range</option>
            <option value="18-24">18 - 24 years old</option>
            <option value="25-29">25 - 29 years old</option>
            <option value="30-34">30 - 34 years old</option>
            <option value="35-39">35 - 39 years old</option>
            <option value="40-44">40 - 44 years old</option>
            <option value="45-49">45 - 49 years old</option>
            <option value="50-54">50 - 54 years old</option>
            <option value="55+">55+</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </Form.Control>

        <Form.Group>
          <Form.Label>What is your gender?</Form.Label>
          <Form.Control as="select" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select gender</option>
            <option value="Woman">Woman</option>
            <option value="Man">Man</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to disclose">Prefer not to disclose</option>
            <option value="Prefer to self-describe">Prefer to self-describe</option>
          </Form.Control>
        </Form.Group>

        {gender === 'Prefer to self-describe' && (
          <Form.Group>
            <Form.Label>Please describe your gender:</Form.Label>
            <Form.Control 
              type="text" 
              value={selfDescribedGender} 
              onChange={(e) => setSelfDescribedGender(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Choose one or more races that you consider yourself to be:</Form.Label>
          <div className="race-checkboxes">
            {['White', 'Black or African American', 'American Indian or Alaska Native', 'Asian', 'Native Hawaiian or Pacific Islander', 'Hispanic', 'Two or more races', 'Not listed', 'Prefer not to answer'].map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                value={option}
                checked={race.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRace([...race, e.target.value]);
                  } else {
                    setRace(race.filter(item => item !== e.target.value));
                  }
                }}
                className="race-checkbox"
              />
            ))}
          </div>
        </Form.Group>

        {race.includes('Not listed') && (
          <Form.Group>
            <Form.Label>Please specify your race:</Form.Label>
            <Form.Control 
              type="text" 
              value={otherRace} 
              onChange={(e) => setOtherRace(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Form.Group>
          <Form.Label>What is the highest degree or level of education you have completed?</Form.Label>
          <Form.Control as="select" value={education} onChange={(e) => setEducation(e.target.value)} required>
            <option value="">Select education level</option>
            <option value="Some high school">Some high school</option>
            <option value="High school">High school</option>
            <option value="Some college">Some college</option>
            <option value="Trade, technical or vocational training">Trade, technical or vocational training</option>
            <option value="Associate's degree">Associate's degree</option>
            <option value="Bachelor's degree">Bachelor's degree</option>
            <option value="Master's degree">Master's degree</option>
            <option value="Professional degree">Professional degree</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>In which country do you currently reside?</Form.Label>
          <CountryDropdown
            value={country}
            onChange={(val) => setCountry(val)}
            classes="form-control"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}