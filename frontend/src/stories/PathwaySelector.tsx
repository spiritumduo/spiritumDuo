import React from 'react';

interface PathwaySelectorProps {
	/**
	* List of pathways to present the user
	*/
	options: Array <string>;
	/**
	* Function to handle item select
	*/
	onItemSelect(pathwayName:string): void;
}

/**
* Primary UI component for user interaction
*/
export const PathwaySelector = (
	{options = ["Default"]
}: PathwaySelectorProps) => {
	let itemList=options.map((item,index)=>{
		return <a className="dropdown-item">{item}</a>
	})
	
	return(
		<div className="dropdown">
			<button className="btn btn-outline-secondary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Dropdown button
			</button>
			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				{itemList}
			</div>
		</div>
	);
};