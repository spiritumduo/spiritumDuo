import React from 'react';
import { Footer } from 'nhsuk-react-components';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SdFooterProps {
}

// eslint-disable-next-line no-empty-pattern
const SdFooter = ({}: SdFooterProps): JSX.Element => (
  <Footer>
    <Footer.List>
      <Footer.ListItem href="/">Landing page</Footer.ListItem>
    </Footer.List>
  </Footer>
);

export default SdFooter;
