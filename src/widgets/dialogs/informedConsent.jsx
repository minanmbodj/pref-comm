import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Link } from 'react-router-dom';

export default function InformedConsentModal(props) {
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const condition = Math.floor(Math.random() * 2) + 12;

  const handleConsent = (e) => {
    setIsLoading(true);
    props.consentCallback(isConsentGiven, condition);
  }

  return (
    <Modal show={props.show} dialogClassName="modal-80w" style={{ zIndex: "2050" }}>
      <Modal.Header>
        <Modal.Title>
          Clemson University<br />
          The Peer Recommendation Platform
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='informedConsent-title'>
          Key Information About the Research Study
        </p>
        <p>
          Dr. Bart Knijnenburg is inviting you to volunteer for a 
          research study. Bart  Knijnenburg is an assistant professor 
          at Clemson University conducting the study with  one of his 
          graduate students, Mina Mbodj, at Clemson University. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Study Purpose:&nbsp;
          </span>
          The purpose of this research is to investigate how a 
          peer-based recommendation system works and the behaviors 
          that it elicits in members of the community. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Voluntary Consent:&nbsp;
          </span>
          Participation is voluntary, and you have the option to not 
          participate. You will not be punished in any way if you 
          decide not to be in the study  or to stop taking part in the 
          study. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Activities and Procedures:&nbsp;
          </span>
          You will be provided a consent form that you will have to 
          sign to agree to the terms and conditions. Once you sign the 
          consent form, you will be  asked to complete the pre-survey, 
          read through The Peer Recommendation Platform introduction 
          page. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Participation Time:&nbsp;
          </span>
          It will take you about 65 minutes to be part of this study. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Risks and Discomforts:&nbsp;
          </span>
          We do not know of any risks or discomforts to you in this 
          research study. You may opt out of the study at any time if 
          you are not comfortable. 
        </p>
        <p>
          <span className='informedConsent-bold'>
            Possible Benefits:&nbsp;
          </span>
          You may not benefit directly for taking part in this study; 
          however,  we believe that this system will help you help. 
        </p>

        <p className='informedConsent-title'>Incentives</p>
        <p>
          For participating in this user study, you will be 
          compensated with TBD upon successful  completion of the 
          study. 
        </p>

        <p className='informedConsent-title'>
          Audio/Video Recording and Photographs
        </p>
        <p>
        Our study does not ask you to provide personal or identifiable 
        information. No audio or video will be recorded while 
        participants will take the study. 
        </p>

        <p className='informedConsent-title'>
          Equipment and Devices that will be used in Research Study
        </p>
        <p>
          Are required: a computer, Internet browser and internet 
          connection to access the survey and take  the experiment. 
        </p>
        
        <p className='informedConsent-title'>
          Protection of Privacy and Confidentiality
        </p>
        <p>
        The results of this study may be published in scientific 
        journals, professional  publications, or educational 
        presentations. Identifiable information collected during  
        the study will be removed and the de-identified information will 
        not be used or  distributed for future research studies. 
        We might be required to share the information  we collect from 
        you with the Clemson University Office of Research Compliance and  
        the federal Office for Human Research Protections. If this happens, 
        the information  would only be used to find out if we ran this 
        study properly and protected your rights  in the study. 
        </p>

        <p className='informedConsent-title'>
          Contact Information
        </p>
        <p>
          If you have any questions or concerns about your rights in this research study, 
          please  contact the Clemson University Office of Research Compliance (ORC) at 
          864-656- 0636 or <a href="mailto:irb@clemson.edu">irb@clemson.edu</a>. The 
          Clemson IRB will not be able to answer some study specific questions. However, 
          you may contact the Clemson IRB if the research staff  cannot be reached or if 
          you wish to speak with someone other than the research staff. 
        </p>
        <p>
          If you have any study related questions or if any problem arise, please contact
          Dr. Bart Knijnenburg (<a href="mailto:bartk@clemson.edu">bartk@clemson.edu</a>).
          Mina Mbodj <a href="mailto:ambodj@g.clemson.edu">ambodj@g.clemson.edu</a>.
        </p>

        <Form className="consent-form">
          <p className="informedConsent-title">Consent</p>
          <p className="informedConsent-bold">
            By participating in the study, you indicate that you have read the information written
            above, been allowed to ask any questions, and you are voluntarily choosing to take part
            in this research. You do not give up any legal rights by taking part in this research study.
          </p>

          <Form.Group controlId="nameInput">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="dateInput">
            <Form.Label>Date:</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            style={{ fontWeight: '500', marginTop: '9px' }}
            label="I consent to being a participant in this study and the use of 
			my educational records  for research purposes. "
            onChange={(evt) => setIsConsentGiven(evt.target.checked)}
            checked={isConsentGiven}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Link to="/quit">
          <Button variant="ersCancel">
            Exit
          </Button>
        </Link>
        <Button 
          variant="ers" 
          disabled={!isConsentGiven || isLoading}
          onClick={(e) => handleConsent(e)}
        >
          {!isLoading ? 'Continue'
            :
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </>
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
}