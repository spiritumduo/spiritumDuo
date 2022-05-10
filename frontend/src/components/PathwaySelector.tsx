import React from 'react';
import { Select } from 'nhsuk-react-components';
import PathwayOption from 'types/PathwayOption';

interface PathwaySelectorProps {
  /**
  * List of pathways to present the user
  */
  options?: PathwayOption[];
  /**
  * Current selected option
  */
  currentOption?: PathwayOption;
  /**
  * Function to handle item select
  */
  onItemSelect(pathwayName:string): void;
}

/**
* Primary UI component for user interaction
*/
const PathwaySelector = ({
  options, currentOption, onItemSelect,
}: PathwaySelectorProps): JSX.Element => {
  // filter out the current option from the item list
  const itemList = options?.map((pathway) => (
    <Select.Option value={ pathway.id } key={ `pathwaySelect-${pathway.id}` }>{pathway.name}</Select.Option>
  ));

  return (
    (itemList?.length as number) > 0
      ? (
        <select className="nhsuk-select float-end" defaultValue={ currentOption?.id } onChange={ (e) => onItemSelect(e.currentTarget.value) }>
          { itemList }
        </select>
      )
      : (
        <select className="nhsuk-select float-end" disabled>
          <Select.Option>No pathways available</Select.Option>
        </select>
      )
  );
};

export default PathwaySelector;
