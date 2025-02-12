import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { useNavigate, useLocation } from 'react-router-dom';
import {
  useStudy,
	CurrentStep, isEmptyStep, NewParticipant, Participant, StudyStep
} from 'rssa-api';
import { InitStudyPageProps } from './StudyPage.types';

import Footer from '../widgets/Footer';
import InformedConsentModal from '../widgets/dialogs/informedConsent';
import HeaderJumbotron from '../widgets/headerJumbotron';

const Welcome: React.FC<InitStudyPageProps> = ({
  next,
  checkpointUrl,
  studyStep,
  setNewParticipant,
  updateCallback }) => {

    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [participant, setParticipant] = useState<Participant>();
    const [show, setShowInformedConsent] = useState<boolean>(false);

    const { studyApi } = useStudy();

    const navigate = useNavigate();
    const location = useLocation();

    const showInformedConsent = () => { setShowInformedConsent(!show); }
    const [showNoConsentMessage, setShowNoConsentMessage] = useState<boolean>(false);

    useEffect(() => {
      if (checkpointUrl !== '/' && checkpointUrl !== location.pathname) {
        navigate(checkpointUrl);
      }
    }, [checkpointUrl, location.pathname, navigate]);

    const consentCallbackHandler = (consent: boolean) => {
      if (consent) {
        if (!isEmptyStep(studyStep))
          studyApi.post<NewParticipant, Participant>('participant/', {
            study_id: studyStep.study_id,
            external_id: 'test_user', // FIXME: change to actual platform id
            participant_type: '149078d0-cece-4b2c-81cd-a7df4f76d15a', // FIXME: use this as part of the environment variables and apiConfig
            current_step: studyStep.id,
            current_page: null
          }).then((response) => {
            setNewParticipant(response);
            setParticipant(response);
          });
      }
    }

    const handleSkipToMovies = () => {
      // FIXME: This is a temporary solution to skip the consent form
    }

    useEffect(() => {
      if (participant) {
        studyApi.post<CurrentStep, StudyStep>('studystep/next', {
          current_step_id: participant.current_step
        }).then((nextStep) => {
          updateCallback(nextStep, next);
          setIsUpdated(true);
        });
      }
    }, [participant, studyApi, updateCallback, navigate, next]);
  
    useEffect(() => {
      if (isUpdated) {
        navigate(next);
      }
  }, [isUpdated, navigate, next]);
  

  return (
    <Container>
      <Row>
        <HeaderJumbotron title="Welcome!"
          content="Thank you for participating in The Peer Recommendation Platform study. Your involvement is crucial for our research." />
      </Row>

      {showNoConsentMessage && (
        <Row>
          <Alert variant="warning">
            You have chosen not to consent to the study. If you change your mind, you can click the "Get started" button again to review the consent form.
          </Alert>
        </Row>
      )}

      <Row>
        <Card bg="light">
          <Card.Body className="instructionblurb">
            <Card.Title>What to expect?</Card.Title>
            <p>
              <em>Consent Form:</em>
            </p>
            <ul>
              <li>
                Begin by reviewing and signing the consent form.
              </li>
              <li>
                Your participation is voluntary, and you can withdraw at any time.
              </li>
            </ul>
            <p>
              <em>Pre-Survey:</em>
            </p>
            <ul>
              <li>
                Complete a brief pre-survey to help us understand your background and preferences.
              </li>
              <li>
                This will take approximately 10 to 15 minutes.
              </li>
            </ul>
            <p>
              <em>Introduction to The Peer Recommendation Platform:</em>
            </p>
            <ul>
              <li>
                Learn about The Peer Recommendation Platform, our innovative community based movie recommender system.
              </li>
              <li>
                Understand its purpose and how it will assist you throughout the study.
              </li>
            </ul>
            <p>
              <em>Complete the Study:</em>
            </p>
            <ul>
              <li>
                Navigate through the system following the guided steps.
              </li>
              <li>
                Engage with the features and provide feedback as prompted.
              </li>
            </ul>
            <p>
              <em>Post-Survey:</em>
            </p>
            <ul>
              <li>
                After completing the study steps, you will be directed to a post-survey.
              </li>
              <li>
                Your feedback will be invaluable for improving the system and understanding your experience.
              </li>
            </ul>
            
            <p>
              We appreciate your time and insights. <strong>Let's get started!</strong>
            </p>
          </Card.Body>
        </Card>
      </Row>

      <InformedConsentModal 
        show={show}
        consentCallback={consentCallbackHandler}
      />
      <Row>
      <Footer callback={showInformedConsent} text={"Get Started"}
					disabled={isEmptyStep(studyStep)} />
      </Row>
    </Container>
  )
}

export default Welcome;