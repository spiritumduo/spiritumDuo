import React from 'react';
import Patient from '../types/Patient';

interface PatientInfoLonghandProps {
	/**
	* Patient object
	*/
	patient: Patient;
}

/**
* Primary UI component for user interaction
*/
const PatientInfoLonghand = (props: PatientInfoLonghandProps) => {
	return(
		<div>
            {props.patient.patientHospitalNumber}, {props.patient.firstName} {props.patient.lastName}, {props.patient.dob?.toLocaleDateString()}
        </div>
	);
};

export default PatientInfoLonghand;