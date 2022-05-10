import React, { useContext, useEffect, useState } from 'react';
import { FormControl, PopoverProps } from 'react-bootstrap';
import classNames from 'classnames';
import { ChevronDown } from 'react-bootstrap-icons';

import './filtermenu.css';
import SdSelectContext from 'components/SdSelect/SdSelectContext';

export const FilterToggle = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLButtonElement>
>(
  ({ onClick, ...props }, ref) => {
    const { selectedOptions } = useContext(SdSelectContext);
    return (
      <div className="filter-toggle" ref={ ref }>
        {
          Array.from(selectedOptions.values()).map(
            (option, index, array) => (
              index < array.length - 1
                ? `${option?.name}, `
                : option?.name
            ),
          )
        }
        <button
          { ...props }
          className="filter-toggle-button"
          type="button"
          onClick={ onClick }
        >
          <span className="nhsuk-u-visually-hidden">Toggle menu</span>
          <ChevronDown />
        </button>
      </div>
    );
  },
);
FilterToggle.displayName = 'FilterToggle';

export type FilterMenuProps = React.PropsWithChildren<{
  style?: React.CSSProperties;
  className?: string;
  'aria-labelledby'?: string;
}> & PopoverProps;

const FilterMenu = React.forwardRef<HTMLDivElement, FilterMenuProps>(
  ({ popper, children, style, className, 'aria-labelledby': labeledBy }, ref): JSX.Element => {
    const [value, setValue] = useState<string>('');
    const { selectedOptions } = useContext(SdSelectContext);
    useEffect(() => {
      // This makes the popup re-render.
      if (popper) popper.scheduleUpdate();
    }, [selectedOptions, popper]);
    return (
      <div
        ref={ ref }
        style={ style }
        className={ classNames('filter-menu', className) }
        aria-labelledby={ labeledBy }
      >
        <label htmlFor="filter-input">
          <FormControl
            name="filter-input"
            id="filter-input"
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={ (e) => setValue(e.target.value) }
            value={ value }
          />
          <span className="nhsuk-u-visually-hidden">Filter menu</span>
        </label>
        <ul>
          {React.Children.toArray(children).filter(
            (child) => {
              if (!value) return true;
              let childString: string | undefined;
              if (typeof child === 'string') {
                childString = child;
              } else if (React.isValidElement(child)) {
                if (typeof child.props.label === 'string') {
                  childString = child.props.label;
                } else if (typeof child.props.children === 'string') {
                  childString = child.props.children;
                }
              } else {
                return false;
              }
              return childString?.trim().toLowerCase().startsWith(value.toLowerCase());
            },
          )}
        </ul>
      </div>
    );
  },
);
FilterMenu.displayName = 'CheckboxMenu';

export default FilterMenu;
