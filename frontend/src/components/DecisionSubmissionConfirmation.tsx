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
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div>
        <h2>Submit these requests?</h2>
        {
          milestones
            ? (
              <>
                <strong>Requests:</strong>
                <ul>
                  {
                    milestones?.map((m) => (
                      <li key={ m.id }>{m.name}</li>
                    ))
                  }
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
                    milestoneResolutions?.map((m, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={ `resolution-${index}}` }>{m}</li>
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
    </Container>
  );
};

export default DecisionSubmissionConfirmation;
