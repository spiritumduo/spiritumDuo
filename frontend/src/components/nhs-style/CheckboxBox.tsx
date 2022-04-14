/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import { Checkboxes as NHSCheckboxes } from 'nhsuk-react-components';

const CheckboxBox = forwardRef<HTMLInputElement, any>(
  // eslint-disable-next-line prefer-arrow-callback
  function Input(props, ref) {
    return <NHSCheckboxes.Box { ...props } inputRef={ ref } />;
  },
);

export default CheckboxBox;
