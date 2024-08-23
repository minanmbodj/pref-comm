import { useNavigate } from "react-router-dom"
import Button from 'react-bootstrap/Button';

export default function MainLandingPage() {
	const navigate = useNavigate();


	return (
		<div>
			<h1>Welcome</h1>
			<Button onClick={() => navigate("/ratemovies")}>Begin</Button>
		</div>
	)
}