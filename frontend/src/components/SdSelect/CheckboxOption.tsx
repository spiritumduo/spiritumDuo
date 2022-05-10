import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import SdSelectContext from 'components/SdSelect/SdSelectContext';

import './checkboxoption.css';

export type CheckboxOptionProps = {
  label: string;
} & React.HTMLProps<HTMLDivElement>;

const CheckboxOption = (
  { value, style, className, name, id, defaultChecked, label,
    ...props }: CheckboxOptionProps,
): JSX.Element => {
  const { selectedOptions, optionOnClick } = useContext(SdSelectContext);
  useEffect(() => {
    if (defaultChecked) optionOnClick(value, label);
  });

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (e.currentTarget.nodeValue !== undefined && value !== undefined) {
      optionOnClick(value, label);
    }
  };
  const keyHandlers = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Tab':
        break;
      default:
        optionOnClick(value, label);
    }
  };
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    optionOnClick(value, label);
  };
  const isSelected = (value && !Array.isArray(value))
    ? selectedOptions.has(value.toString())
    : false;
  return (
    <div
      { ...props }
      role="option"
      aria-selected={ isSelected }
      tabIndex={ 0 }
      style={ style }
      className={ classNames('checkbox-option', className) }
      onClick={ clickHandler }
      onKeyDown={ keyHandlers }
    >
      <label htmlFor={ id }>
        <input
          className="checkbox-option-input"
          type="checkbox"
          name={ name }
          id={ id }
          checked={ isSelected }
          value={ value }
          onClick={ (e) => e.stopPropagation() }
          onChange={ changeHandler }
        />
        &nbsp;{ label }
      </label>
    </div>
  );
};
CheckboxOption.displayName = 'CheckboxInput';

export default CheckboxOption;
