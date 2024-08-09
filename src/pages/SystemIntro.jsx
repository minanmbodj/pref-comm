import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNextStudyStep, sendLog }from '../middleware/api-middleware';
import NextButton from '../widgets/nextButton';
import HeaderJumbotron from '../widgets/headerJumbotron';

export default function SystemIntro(props) {
	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
    const [studyStep, setStudyStep] = useState({});

	const [starttime, setStarttime] = useState(new Date());
	const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getNextStudyStep(userdata.study_id, stepid)
            .then((value) => { setStudyStep(value) });
		setStarttime(new Date());
    }, []);


	const handleNextClick = () => {
        // Log the action or do other tasks if necessary
        sendLog(userdata, studyStep.id, new Date() - new Date(), 'clicked next', 'navigate', null, null);
        
        // Navigate to the next page specified by props.next
        navigate(props.next, {
            state: { user: userdata, studyStep: studyStep.id }
        });
    };

	return (
		<Container>
			<Row>
				<HeaderJumbotron title="System Introduction"
					content="The following is an introduction to the system." />
			</Row>

			<Row>
				<Card bg="light">
					<Card.Body className="instructionblurb">
						<Card.Title>What can you expect?</Card.Title>
						<p>
							Ex Text
						</p>
						<p>
                            Ex Text
						</p>
						<ol>
							<li>
                                Ex Text
							</li>
							<li>
                                Ex Text
							</li>
							<li>
                                Ex Text
							</li>
							<li>Ex Text</li>
						</ol>
						<p>
							Thanks,<br />
							Research Team
						</p>
					</Card.Body>
				</Card>
			</Row>

			<Row>
				<div className="jumbotron jumbotron-footer">
				<NextButton
                        variant="ers"
                        size="lg"
                        className="footer-btn"
                        onClick={handleNextClick}  // Attach the click handler here
                    >
                        Get started
                    </NextButton>
				</div>
			</Row>
		</Container>
	)
}