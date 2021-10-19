import React from 'react';
import { Link } from "react-router-dom";

interface PathwaySelectorProps {
	/**
	* List of pathways to present the user
	*/
	options: Array <string>;
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
export const PathwaySelector = (
	{
		options = ["Default"],
		currentOption = "Default"
}: PathwaySelectorProps) => {
	let itemList=options.map((item,index)=>{
		return <Link className="dropdown-item" to={"/page/"}>Refer</Link>;
	})
	
	return(
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