import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNextStudyStep }from '../middleware/api-middleware';
import NextButton from '../widgets/nextButton';
import HeaderJumbotron from '../widgets/headerJumbotron';

export default function SystemIntro(props) {
	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
    const [studyStep, setStudyStep] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        getNextStudyStep(userdata.study_id, stepid)
            .then((value) => { setStudyStep(value) });
    }, []);
    // useEffect(() => {
    //     getNextStudyStep( stepid)
    //         .then((value) => { setStudyStep(value) });
    // }, []);



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
					<NextButton variant="ers" size="lg" className="footer-btn">
						Get started
					</NextButton>
				</div>
			</Row>
		</Container>
	)
}