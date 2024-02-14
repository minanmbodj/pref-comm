import { useEffect, useState } from "react";
import { Badge, Button, Image } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { default_movie_thumbnail } from "../../../constants/defaults";
import { imgurl } from "../../../middleware/requests";

export default function AdvisorsPanel({ activeSelection, advisors, selectCallback }) {

	return (
		<div style={{ border: "2px solid" }}>
			<Row>
				<h2>Your Advisors</h2>
			</Row>
			<Row>
				<ul>
					{advisors.map((advisor) =>
						<AdvisorListItem advisor={advisor}
							key={advisor.id}
							selected={advisor.id === activeSelection}
							selectCallback={selectCallback} />)}
				</ul>
			</Row>
		</div>
	)
}

const AdvisorListItem = ({ advisor, selected, selectCallback }) => {
	
	const listClass = "AdvisorPanel-list-item";
	
	return (
		<li className={listClass} onClick={() => selectCallback(advisor.id)}>
			<Image className="AdvisorPanel-list-item-image"
				src={imgurl(advisor.poster_identifier)} thumbnail />
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
