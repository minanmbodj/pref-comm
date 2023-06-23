import { useState } from "react"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import AdvisorDetails from "./AdvisorDetails"
import AdvisorsPanel from "./AdvisorsPanel"
import "./AdvisorsWidget.css"
import { advisors as dummyadvisors } from "./dummydata"


export default function AdvisorsWidget() {

	const [advisors, setAdvisors] = useState(dummyadvisors);
	const [activeSelection, setActiveSelection] = useState(null);

	const handleSelect = (advisorid) => {
		const selectedAdvisor = advisors.find((advisor) =>
			advisor.id === advisorid);
		setActiveSelection(selectedAdvisor);
	}

	const handleRating = (rating, advisorid) => {
		const selectedAdvisor = advisors.find((advisor) =>
			advisor.id === advisorid);
		selectedAdvisor.rating = rating;
		const newAdvisors = advisors.map((advisor) => {
			if (advisor.id === advisorid) {
				return selectedAdvisor;
			} else {
				return advisor;
			}
		}
		);
		setAdvisors(newAdvisors);
	}

	return (
		<Row>
			<Col sm={4}>
				<AdvisorsPanel advisors={advisors}
					activeSelection={activeSelection && activeSelection.id}
					selectCallback={handleSelect} />
			</Col>
			<Col sm={8}>
				<AdvisorDetails advisor={activeSelection}
					ratingCallback={handleRating} />
			</Col>
		</Row>
	)
}
