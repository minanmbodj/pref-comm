import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { post, getNextStudyStep, sendLog } from '../../middleware/api-middleware';
import { LoadingScreen } from "../ratemovies/MovieRatingPage";
import AdvisorsWidget from "./components/AdvisorsWidget";
import { useLocation, useNavigate } from 'react-router-dom';
import '../ratemovies/components/MovieGrid.css';

export default function AdvisorsPage(props) {
    const userdata = useLocation().state.user;
    const stepid = useLocation().state.studyStep;
    const navigate = useNavigate();

    const [studyStep, setStudyStep] = useState(props.studyStep);
    const [starttime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    const state = useLocation().state;

    useEffect(() => {
        getNextStudyStep(userdata.study_id, stepid)
            .then((value) => { 
                setStudyStep(value);
                fetchRecommendations();
            });
    }, [userdata.study_id, stepid]);

    const fetchRecommendations = () => {
        const ratedMoviesData = state ? state.ratings : [];
        const recType = state ? state.recType : 0;
        
        if (ratedMoviesData.length > 0) {
            post('prefComm/advisors/', {
                ratings: ratedMoviesData,
                rec_type: recType,
                num_rec: 7,
                user_id: userdata.id
            })
            .then(response => response.json())
            .then(advisors => {
                setRecommendations(advisors);
                setLoading(false);
                sendLog(userdata, studyStep.id, null, new Date() - starttime, 
                    'advisors_loaded', 'fetch', null, null);
            })
            .catch(error => {
                console.log("Error:", error);
                setLoading(false);
            });
        }
    };

    const handleAdvisorSelection = (advisorId) => {
        sendLog(userdata, studyStep.id, null, new Date() - starttime, 
            'advisor_selected', 'select', advisorId, null);
    };

    const handleAdvisorRating = (advisorId, rating) => {
        sendLog(userdata, studyStep.id, null, new Date() - starttime, 
            'advisor_rated', 'rate', advisorId, rating);
    };

    const handleNextStep = () => {
        sendLog(userdata, studyStep.id, null, new Date() - starttime, 
            'advisors_complete', 'next', null, null);
        navigate(props.next, { state: { user: userdata, studyStep: studyStep.id } });
    };

    return (
        <>
            {loading ? (
                <LoadingScreen 
                    loading={loading}
                    loadingMessage={'Please wait while the system prepares your recommendations'}
                    loadingByline={"This may take a while."}
                />
            ) : (
                <Container className="Main-content">    
                    <AdvisorsWidget 
                        currentAdvisors={recommendations}
                        onAdvisorSelect={handleAdvisorSelection}
                        onAdvisorRate={handleAdvisorRating}
                        onComplete={handleNextStep}
                    />
                </Container>
            )}
        </>
    );
}