import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './searchresults.css';

export interface SearchResultProps {
  results: {
    id: string;
    firstName: string;
    lastName: string;
    hospitalNumber: string;
    nationalNumber: string;
  }[];
  onClickCallback: (hospitalNumber: string) => void;
}

const SearchResults = ({ results, onClickCallback }: SearchResultProps) => (
  <div className="search-results-box">
    {
      results.map( (sr) => (
        <Row
          key={ `sr-row-${sr.id}` }
          sm="12"
          className="search-results-row"
          onClick={ () => onClickCallback(sr.hospitalNumber) }
        >
          <Col sm="5">
            <button
              type="button"
              role="link"
              className="sd-hidden-button"
              onClick={ () => onClickCallback(sr.hospitalNumber) }
            >
              {sr.firstName} {sr.lastName}
            </button>
          </Col>
          <Col sm="3">{sr.hospitalNumber}</Col>
          <Col sm="3">{sr.nationalNumber}</Col>
        </Row>
      ))
    }
  </div>
);

export default SearchResults;
