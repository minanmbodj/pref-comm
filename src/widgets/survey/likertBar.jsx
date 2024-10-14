import {  useState } from "react";
import FormLabel from "react-bootstrap/FormLabel";

export default function LikertBar(props) {

	const likertLikelihood = [
		{ id: 1, label: 'very slightly or not at all' },
		{ id: 2, label: 'a little' },
		{ id: 3, label: 'moderately' },
		{ id: 4, label: 'quite a bit' },
		{ id: 5, label: 'extremely' }];

	const likertSatisfaction = [
		{ id: 1, label: 'I strongly disagree' },
		{ id: 2, label: 'I disagree' },
		{ id: 3, label: 'I rather disagree' },
		{ id: 4, label: 'It is indifferent to me' },
		{ id: 5, label: 'I rather agree' },
		{ id: 6, label: 'I agree' }, 
		{ id: 7, label: 'I strongly agree' }];

	// Choose the appropriate set based on props or default to agreement
    const likert = props.type === 'likelihood' ? likertLikelihood :
                   likertSatisfaction;

    const qgroup = props.surveyquestiongroup;
    const qid = props.qid;
	const [selectedValue, setSelectedValue] = useState(undefined);

	const handleRadioChange = (val) => {
		setSelectedValue(val);
		props.changeCallback(qid, val);
	}

	return (
		<div className="checkboxGroup">
			{likert.map((likertval) => {
				return (
					<FormLabel htmlFor={qgroup + "_" + qid + "_" + likertval.id}
						key={qgroup + "_" + qid + "_" + likertval.id}
						className={selectedValue === likertval.id ? "checkboxBtn checkboxBtnChecked" : "checkboxBtn"}>

						<p className="checkboxLbl">{likertval.label}</p>

						<input className="radio-margin" type="radio"
							name={qgroup + "_" + qid + "_" + likertval.id}
							value={likertval.id}
							id={qgroup + "_" + qid + "_" + likertval.id}
							checked={selectedValue === likertval.id}
							onChange={(evt) => handleRadioChange(parseInt(evt.target.value))}
						/>
					</FormLabel>
				);
			}
			)}
		</div>
	)
}