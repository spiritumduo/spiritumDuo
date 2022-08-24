import React from 'react';
import Select, { CSSObjectWithLabel } from 'react-select';

const selectionStyle = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    border: '2px solid #4c6272',
    borderRadius: '0px',
  }),

  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    border: '2px solid #4c6272',
    borderRadius: '0px',
  }),
};

const ReactSelectWrapper = ({ ...rest }) => (
  <Select
    styles={ selectionStyle }
    { ...rest }
  />
);

export default ReactSelectWrapper;
