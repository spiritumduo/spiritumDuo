import React, { InputHTMLAttributes, useEffect, useContext, useRef, useState, ChangeEvent, useMemo } from 'react';
import { Overlay } from 'react-bootstrap';
import SdSelectContext, { SdSelectContextProvider } from 'components/SdSelect/SdSelectContext';
import FilterMenu, { FilterToggle } from './FilterMenu';

import './sdselect.css';

export type SdSelectProps = {
  label: string;
} & React.PropsWithChildren<InputHTMLAttributes<HTMLSelectElement>>;

const SdSelectElement = React.forwardRef<
  HTMLSelectElement,
  InputHTMLAttributes<HTMLSelectElement>
>((
  { name, onChange, onBlur }, ref,
): JSX.Element => {
  const { selectedOptions } = useContext(SdSelectContext);
  const innerRef = useRef<HTMLSelectElement | null>(null);
  useEffect(() => {
    const elem = innerRef.current;
    if (elem) {
      elem.dispatchEvent(new Event('change'));
    }
  }, [innerRef, selectedOptions]);

  function onChangeFn(e: HTMLElementEventMap['change']) {
    // This is because we are manually adding the event listener. There has to be a better way
    // to do this.
    if (onChange) onChange(e as unknown as ChangeEvent<HTMLSelectElement>);
  }

  return (
    <select
      name={ name }
      style={ { display: 'none' } }
      onBlur={ onBlur }
      onChange={ (e) => onChangeFn(e as unknown as HTMLElementEventMap['change']) }
      ref={ (elem) => {
        elem?.addEventListener<'change'>('change', onChangeFn);
        innerRef.current = elem;
        if (typeof ref === 'function') {
          ref(elem);
        } else if (ref) {
          // we have to do param-reassign to pass the element back up
          // eslint-disable-next-line no-param-reassign
          ref.current = elem;
        }
      } }
      value={ Array.from(selectedOptions.values()).map((o) => o.value) }
      multiple
    >
      {Array.from(selectedOptions).map(
        (o) => (
          // This is hidden, our custom controls have labels
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <option
            key={ o[1].value }
            value={ o[1].value }
          >
            {o[1].name}
          </option>
        ),
      )}
    </select>
  );
});
SdSelectElement.displayName = 'SdSelectElement';

const SdSelect = React.forwardRef<HTMLSelectElement, SdSelectProps>(
  ({ children, name, onChange, onBlur, label }, ref): JSX.Element => {
    const target = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    function toggleOnClick() {
      setShow(!show);
    }
    const defaultChecked = useMemo(() => React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.props.defaultChecked && child.props.value && child.props.label) {
          return {
            value: child.props.value,
            name: child.props.label,
          };
        }
      }
      return undefined;
    }), [children]);
    return (
      <SdSelectContextProvider initialChecked={ defaultChecked || undefined }>
        <label htmlFor={ name }>
          {label}
          <div
            role="listbox"
            aria-multiselectable
            aria-label={ label }
          >
            <SdSelectElement
              name={ name }
              ref={ ref }
              onChange={ onChange }
              onBlur={ onBlur }
            />
            <div className="checkbox-select-container" ref={ container }>
              <FilterToggle onClick={ () => toggleOnClick() } ref={ target } />
            </div>
            <Overlay container={ container } target={ target.current } show={ show } placement="bottom-start" onHide={ () => setShow(false) } rootClose>
              <FilterMenu>
                {children}
              </FilterMenu>
            </Overlay>
          </div>
        </label>
      </SdSelectContextProvider>
    );
  },
);
SdSelect.displayName = 'SdSelect';

export default SdSelect;
