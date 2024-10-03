import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import {
  createTestUser, createUser, getFirstStudyStep,
  getStudy, sendLog
} from '../middleware/api-middleware';
import InformedConsentModal from '../widgets/dialogs/informedConsent';
import HeaderJumbotron from '../widgets/headerJumbotron';

export default function Welcome(props) {

  const studyID = 2;

  const [show, setShowInformedConsent] = useState(false);
  const [userdata, setUserdata] = useState({});
  const [study, setStudy] = useState({});
  const [studyStep, setStudyStep] = useState({});
  const [starttime, setStarttime] = useState(Date.now());

  const showInformedConsent = () => {
    setShowInformedConsent(!show);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const userProps = ['id', 'condition', 'user_type', 'seen_items'];
    if (userProps.every(item => userdata.hasOwnProperty(item))) {
      sendLog(userdata, studyStep.id, null, starttime - new Date(),
        'user creation', 'study consent', null, null).then(() => {
          navigate(props.next,
            {
              state: {
                user: userdata,
                studyStep: studyStep.id
              }
            });
        })
    }
  }, [userdata, navigate, studyStep, props.next, starttime]);

  useEffect(() => {
    getStudy(studyID).then((studyres) => { setStudy(studyres) });
    getFirstStudyStep(studyID).then((studyStepRes) => {
      setStudyStep(studyStepRes);
    });
    setStarttime(new Date());

  }, []);

  const consentCallbackHandler = (consent, condition) => {
    if (consent) {
      createTestUser('prefCommStudy', study.id, condition)
        .then((response) => response.json())
        .then((user) => {
          setUserdata(user);
          navigate(props.next, { 
            state: { 
              user: user, 
              studyStep: studyStep.id 
            } 
          });
        })
        .catch((error) => console.log(error));
    }
    else {
      navigate('/quit');
    }
  }

  const handleSkipToMovies = () => {
    createTestUser('prefCommStudy', study.id, 0)
      .then((response) => response.json())
      .then((user) => {
        setUserdata(user);
        navigate('/ratemovies', { 
          state: { 
            user: user, 
            studyStep: studyStep.id 
          } 
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container>
      <Row>
        <HeaderJumbotron title="Welcome!"
          content="Thank you for participating in The Peer Recommendation Platform study. Your involvement is crucial for our research." />
      </Row>

      <Row>
        <Card bg="light">
          <Card.Body className="instructionblurb">
            <Card.Title>What to expect?</Card.Title>
            <p>
              <em>Consent Form:</em>
            </p>
            <ol>
              <li>
                Begin by reviewing and signing the consent form.
              </li>
              <li>
                Your participation is voluntary, and you can withdraw at any time.
              </li>
            </ol>
            <p>
              <em>Demographics</em>
            </p>
            <p>
              <em>Pre-Survey:</em>
            </p>
            <ol>
              <li>
                Complete a brief pre-survey to help us understand your background and preferences.
              </li>
              <li>
                This will take approximately 10 to 15 minutes.
              </li>
            </ol>
            <p>
              <em>Introduction to The Peer Recommendation Platform:</em>
            </p>
            <ol>
              <li>
                Learn about The Peer Recommendation Platform, our innovative community based movie recommender system.
              </li>
              <li>
                Understand its purpose and how it will assist you throughout the study.
              </li>
            </ol>
            <p>
              <em>Complete the Study:</em>
            </p>
            <ol>
              <li>
                Navigate through the system following the guided steps.
              </li>
              <li>
                Engage with the features and provide feedback as prompted.
              </li>
            </ol>
            <p>
              <em>Post-Survey:</em>
            </p>
            <ol>
              <li>
                After completing the study steps, you will be directed to a post-survey.
              </li>
              <li>
                Your feedback will be invaluable for improving the system and understanding your experience.
              </li>
            </ol>
            
            <p>
              We appreciate your time and insights. <strong>Let's get started!</strong>
            </p>
          </Card.Body>
        </Card>
      </Row>

      <InformedConsentModal show={show}
        consentCallback={consentCallbackHandler} />
      <Row>
        <div className="jumbotron jumbotron-footer d-flex justify-content-between align-items-center">
          <Button 
            variant="secondary" 
            onClick={handleSkipToMovies}
            style={{ marginRight: 'auto' }}
          >
            Skip to Movies
          </Button>
          <Button 
            variant="ers" 
            size="lg" 
            className="footer-btn"
            onClick={showInformedConsent}
          >
            Get started
          </Button>
        </div>
      </Row>
    </Container>
  )
}