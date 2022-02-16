import React from 'react';
import { Button, Container } from 'react-bootstrap';

const PathwayComplete = (
): JSX.Element => (
  <Container className="d-flex align-items-center justify-content-left mt-5">
    <div className="d-flex align-items-center">
      <div>
        <strong>You have completed the pathway!</strong>
        <div className="mt-lg-4">
          <p>
            The pathway is now complete! Congratulations on completing
            the demo!
          </p>
        </div>
        <Button className="float-end w-25 mt-lg-4" variant="outline-secondary" href="/app/">
          OK
        </Button>
      </div>
    </div>
  </Container>
);

export default PathwayComplete;
