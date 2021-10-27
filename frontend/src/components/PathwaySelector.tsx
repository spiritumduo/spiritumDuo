import React from 'react';
import { Link } from 'react-router-dom';

interface PathwaySelectorProps {
  /**
  * List of pathways to present the user
  */
  options: Array<string>;
  /**
  * Current selected option
  */
  currentOption: string;
  /**
  * Function to handle item select
  */
  onItemSelect(pathwayName:string): void;
}

/**
* Primary UI component for user interaction
*/
const PathwaySelector = ({ options = ['Default'], currentOption = 'Default', onItemSelect }: PathwaySelectorProps): JSX.Element => {
  // filter out the current option from the item list
  const itemList = options.map((item) => (
    item !== currentOption ? <Link key={ `pathwaySelect-${item}` } className="dropdown-item" to={ `/page/${item}` }>{item}</Link> : undefined
  ));

  return (
    <div className="dropdown">
      <button className="btn btn-outline-secondary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {currentOption}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {itemList}
      </div>
    </div>
  );
};

export default PathwaySelector;
