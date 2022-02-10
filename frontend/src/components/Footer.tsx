import React from 'react';
import './footer.css';

export interface FooterProps {
    name: string;
}

const Footer = ({ name }: FooterProps): JSX.Element => (
  <footer className="container">
    <div className="row justify-content-end">
      <div className="col" />
    </div>
  </footer>
);

export default Footer;
