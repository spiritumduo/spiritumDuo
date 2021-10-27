import React from 'react';
import { LogoutLink } from './Link';
import './footer.css';

export interface FooterProps {
    name: string;
}

const Footer = ({ name }: FooterProps) => (
  <footer className="container">
    <div className="row justify-content-end">
      <div className="col">
        <LogoutLink name={ name } />
      </div>
    </div>
  </footer>
);

export default Footer;
