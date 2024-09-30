import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNextStudyStep, sendLog } from '../middleware/api-middleware';
import NextButton from '../widgets/nextButton';

export default function FeedbackPage(props) {
    const userdata = useLocation().state?.user;
    const stepid = useLocation().state?.studyStep;
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [yesNoResponse, setYesNoResponse] = useState('');
    const [whyResponse, setWhyResponse] = useState('');
    const [feedbackData, setFeedbackData] = useState(null);
    const [error, setError] = useState(null);
    const [studyStep, setStudyStep] = useState(null);

    const [starttime] = useState(new Date());

    useEffect(() => {
        if (userdata && userdata.study_id && stepid) {
            getNextStudyStep(userdata.study_id, stepid)
                .then((value) => { 
                    setStudyStep(value);
                    // You can add any additional function calls here if needed
                })
                .catch((error) => {
                    console.error("Error fetching next study step:", error);
                    setError("Failed to prepare the next step. Please try again.");
                });
        } else {
            setError("Missing user data or step ID. Please start over.");
        }
    }, [userdata, stepid]);

    const handleYesNoChange = (value) => {
        setYesNoResponse(value);
        updateButtonState(value, whyResponse);
    }

    const handleWhyChange = (evt) => {
        setWhyResponse(evt.target.value);
        updateButtonState(yesNoResponse, evt.target.value);
    }

    const updateButtonState = (yesNo, why) => {
        setButtonDisabled(yesNo === '' || why.length <= 1);
    }

    const handleNextStep = () => {
        setLoading(true);

        const newFeedbackData = {
            believedReal: yesNoResponse,
            explanation: whyResponse,
            timestamp: new Date().toISOString()
        };

        setFeedbackData(newFeedbackData);

        // Log the action
        sendLog(userdata, stepid, null, new Date() - starttime, 'feedback_submitted', 'next', null, null)
            .then(() => {
                console.log("Feedback submitted:", newFeedbackData);
                // Navigate to the next page
                navigate(props.next, { 
                    state: { 
                        user: userdata, 
                        studyStep: studyStep.id,
                        feedbackData: newFeedbackData  // Pass the feedback data to the next page if needed
                    } 
                });
            })
            .catch((error) => {
                console.error("Error logging feedback:", error);
                setError("An error occurred while submitting your feedback. Please try again.");
                setLoading(false);
            });
    }

    const YesNoBox = ({ value, color, onClick }) => (
        <div 
            onClick={() => onClick(value)}
            style={{
                border: `2px solid ${color}`,
                borderRadius: '8px',
                padding: '10px 20px',
                margin: '0 10px',
                cursor: 'pointer',
                backgroundColor: yesNoResponse === value ? color : 'transparent',
                color: yesNoResponse === value ? 'white' : color,
                transition: 'all 0.3s ease',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100px',
                boxShadow: yesNoResponse === value ? `0 0 10px ${color}` : 'none'
            }}
        >
            {value}
        </div>
    );

    if (error) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-danger">Error</Card.Title>
                                <Card.Text>{error}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="bg-secondary text-white">One Last Question</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label as="h6">Did you believe that your peer recommenders were real people?</Form.Label>
                                    <div className="d-flex justify-content-center mt-3">
                                        <YesNoBox value="Yes" color="#28a745" onClick={handleYesNoChange} />
                                        <YesNoBox value="No" color="#dc3545" onClick={handleYesNoChange} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label as="h6">Why?</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        onChange={handleWhyChange}
                                        placeholder="Please explain your answer..."
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center mt-4">
                <Col md={8}>
                    <div className="d-flex justify-content-end">
                        <NextButton 
                            disabled={buttonDisabled || loading}
                            loading={loading} 
                            onClick={handleNextStep} 
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}