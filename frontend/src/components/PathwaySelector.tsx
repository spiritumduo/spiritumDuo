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
  currentOption: PathwayOption;
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
    pathway !== currentOption ? <Link key={ `pathwaySelect-${pathway.id}` } className="dropdown-item" to={ `/page/${pathway}` }>{pathway}</Link> : undefined
  ));

  return (
    <div className="dropdown">
      <button className="btn btn-outline-secondary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {currentOption.name}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {itemList}
      </div>
    </div>
  );
};

export default PathwaySelector;
