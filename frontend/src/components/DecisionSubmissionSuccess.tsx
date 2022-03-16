import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

export interface DecisionSubmissionSuccessProps {
  milestones?: {
    id: string;
    name: string;
  }[];
  milestoneResolutions?: string[];
}

const DecisionSubmissionSuccess = (
  { milestones, milestoneResolutions }: DecisionSubmissionSuccessProps,
): JSX.Element => {
  const milestonesElement: JSX.Element[] | undefined = milestones?.map(
    (m) => (<li key={ m.id }>{m.name}</li>),
  );
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div className="d-flex align-items-center">
        <div>
          <h2>Decision Submitted</h2>
          {
            milestonesElement
              ? (
                <>
                  <strong>Requests sent:</strong>
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
          <div className="mt-lg-4">
            <p>
              Your decision has now been submitted. You shall
              receive confirmation of any requests shortly.
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
