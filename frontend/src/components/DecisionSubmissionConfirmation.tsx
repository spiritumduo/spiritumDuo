import React from 'react';
import { Button, Container } from 'react-bootstrap';

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
                <div>These results have now been acknowledged:
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
          <Button className="float-end w-25 mt-lg-4" variant="outline-secondary" onClick={ cancelCallback }>
            Cancel
          </Button>
          <Button className="float-end w-25 mt-lg-4" variant="outline-secondary" onClick={ okCallback }>
            OK
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DecisionSubmissionConfirmation;
