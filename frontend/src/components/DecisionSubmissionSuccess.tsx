import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

export interface DecisionSubmissionSuccessProps {
  milestones?: {
    id: string;
    name: string;
  }[]
}

const DecisionSubmissionSuccess = (
  { milestones }: DecisionSubmissionSuccessProps,
): JSX.Element => {
  const milestonesElement: JSX.Element[] | undefined = milestones?.map(
    (m) => (<li key={ m.id }>{m.name}</li>),
  );
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div className="d-flex align-items-center">
        <div>
          <strong>Requests sent:</strong>
          <ul>
            {
              milestonesElement ? (
                <>
                  { milestonesElement }
                </>
              ) : ''
            }
          </ul>
          <div className="mt-lg-4">
            <p>
              The above requests have now been submitted. You shall
              receive confirmation of completion of requests shortly.
            </p>
          </div>
          <Button className="float-end w-25 mt-lg-4" variant="outline-secondary" href="/app/">
            OK
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DecisionSubmissionSuccess;
