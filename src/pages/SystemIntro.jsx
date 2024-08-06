import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import getNextStudyStep from '../utils/api-middleware';
import NextButton from '../widgets/nextButton';

export default function SystemIntro(props) {
	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	return (
		<div>
			<h1>Welcome</h1>
			<Button onClick={() => navigate("/ratemovies")}>Begin</Button>
		</div>
	)
}