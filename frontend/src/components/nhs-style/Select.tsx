/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import { Select as NHSSelect } from 'nhsuk-react-components';

const Select = forwardRef<HTMLSelectElement, any>(
  // eslint-disable-next-line prefer-arrow-callback
  function Input(props, ref) {
    return <NHSSelect { ...props } selectRef={ ref } />;
  },
);

export default Select;
