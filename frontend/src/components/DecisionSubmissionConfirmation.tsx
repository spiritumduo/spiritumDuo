import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'nhsuk-react-components';

export interface DecisionSubmissionConfirmationProps {
  cancelCallback: () => void;
  okCallback: () => void;
  milestones?: {
    id: string;
    name: string;
  }[];
  milestoneResolutions?: string[];
}

const DecisionSubmissionConfirmation = (
  { milestones, milestoneResolutions,
    cancelCallback, okCallback }: DecisionSubmissionConfirmationProps,
): JSX.Element => {
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const milestonesElement: JSX.Element[] | undefined = milestones?.map(
    (m) => (<li key={ m.id }>{m.name}</li>),
  );
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div className="d-flex align-items-center">
        <div>
          <h2>Submit these requests?</h2>
          {
            milestonesElement
              ? (
                <>
                  <strong>Requests:</strong>
                  <ul>
                    { milestonesElement }
                  </ul>
                </>
              )
              : ''
          }
          {
            milestoneResolutions
              ? (
                <div>By clicking &apos;OK&apos; you are acknowledging:
                  <ul>
                    {
                      milestoneResolutions?.map((m) => (
                        <li key={ Math.random() }>{m}</li>
                      ))
                    }
                  </ul>
                </div>
              )
              : false
          }
          <Button
            disabled={ disabledState }
            className="float-end mt-lg-4"
            secondary
            onClick={ cancelCallback }
          >
            Cancel
          </Button>
          <Button
            disabled={ disabledState }
            className="float-end mt-lg-4 me-1"
            onClick={ () => {
              setDisabledState(true);
              okCallback();
            } }
          >
            OK
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DecisionSubmissionConfirmation;
