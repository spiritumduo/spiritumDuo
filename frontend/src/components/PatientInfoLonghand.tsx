import React from 'react';

interface PatientInfoLonghandProps {
	/**
	* Patient's hospital identifier (eg MRN1234567)
	*/
	hospitalIdentifier: string;
    /**
	* Patient's full name
	*/
	name: string;
    /**
	* Patient's date of birth 
    TODO: Could look into making this into a format via component or w/e
    Factory with data validation?
	*/
	dateOfBirth: Date;
}

/**
* Primary UI component for user interaction
*/
const PatientInfoLonghand = (props: PatientInfoLonghandProps) => {
	return(
		<div>
            {props.hospitalIdentifier}, {props.name}, {props.dateOfBirth.toLocaleDateString()}
        </div>
	);
};

export default PatientInfoLonghand;