import Container from "react-bootstrap/Container";
import AdvisorsWidget from "./AdvisorsWidget/AdvisorsWidget";


export default function AdvisorsPage(props) {
	return (
		<Container className={props.className}>
			<AdvisorsWidget />
		</Container>
	)
}
