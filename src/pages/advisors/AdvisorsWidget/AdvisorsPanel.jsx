import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { default_movie_thumbnail } from "../../../constants/defaults";

export default function AdvisorsPanel(props) {

	const [selectedAdvisor, setSelectedAdvisor] = useState(null);
	useEffect(() => {
		props.activeSelection && setSelectedAdvisor(props.activeSelection)
	}, [props.activeSelection]);

	const [advisors, setAdvisors] = useState(props.advisors);
	useEffect(() => { setAdvisors(props.advisors) }, [props.advisors]);

	const selectCallback = props.selectCallback || (() => { });

	return (
		<div style={{ border: "2px solid" }}>
			<Row>
				<h2>Advisors</h2>
			</Row>
			<Row>
				<ul>
					{advisors.map((advisor) =>
						<AdvisorListItem advisor={advisor}
							key={advisor.id}
							selected={advisor.id === selectedAdvisor}
							selectCallback={selectCallback} />)}
				</ul>
			</Row>
		</div>
	)
}

function AdvisorListItem(props) {
	const [advisor, setAdvisor] = useState(props.advisor);
	useEffect(() => { setAdvisor(props.advisor) }, [props.advisor]);

	const [listClass, setListClass] = useState("AdvisorPanel-list-item");
	useEffect(() => {
		setListClass(
			props.selected ?
				"AdvisorPanel-list-item selected" : "AdvisorPanel-list-item"
		)
	}, [props.selected]);

	const [image, setImage] = useState(default_movie_thumbnail);
	useEffect(() => {
		advisor.image && setImage(advisor.image)
	}, [advisor.image]);

	const selectCallback = props.selectCallback || (() => { });

	return (
		<li className={listClass} onClick={() => selectCallback(advisor.id)}>
			<Image className="AdvisorPanel-list-item-image"
				src={image} thumbnail />
			<div className="AdvisorPanel-list-item-desc">
				<h4>
					{advisor.name}
				</h4>
				<p>
					{advisor.advice_preview}
				</p>
			</div>
		</li>
	)
}