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
	dateOfBirth: string;
}

/**
* Primary UI component for user interaction
*/
export const PatientInfoLonghand = (
	{
        hospitalIdentifier="MRN0000000",
        name="first last",
        dateOfBirth="01/01/1970"
    }: PatientInfoLonghandProps) => {
	return(
		<p>
            {hospitalIdentifier}, {name}, {dateOfBirth}
        </p>
	);
};