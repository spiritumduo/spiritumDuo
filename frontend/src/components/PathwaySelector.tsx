import { Select } from 'nhsuk-react-components';
import React from 'react';
import { Link } from 'react-router-dom';
import PathwayOption from 'types/PathwayOption';

interface PathwaySelectorProps {
  /**
  * List of pathways to present the user
  */
  options: PathwayOption[];
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
  const itemList = options.map((pathway) => (
    pathway !== currentOption ? <Select.Option key={ `pathwaySelect-${pathway.id}` }>{pathway.name}</Select.Option> : undefined
  ));

  return (
    <select className="nhsuk-select" disabled onChange={ (e) => onItemSelect(e.currentTarget.value) }>
      {itemList}
    </select>
  );
};

export default PathwaySelector;
