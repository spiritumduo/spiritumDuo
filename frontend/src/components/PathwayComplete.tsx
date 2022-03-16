import React from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'nhsuk-react-components';

const PathwayComplete = (): JSX.Element => (
  <Container className="d-flex align-items-center justify-content-left mt-5">
    <div className="d-flex align-items-center">
      <div>
        <strong>You have completed the pathway!</strong>
        <div className="mt-lg-4">
          <p>
            The pathway is now complete! Congratulations on completing
            the pathway for this patient!
          </p>
        </div>
        <Button className="float-end mt-lg-4" href="/app/">
          OK
        </Button>
      </div>
    </div>
  </Container>
);

export default PathwayComplete;
