import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PatientCommunicationMethods } from 'types/Patient';
import { gql, useMutation } from '@apollo/client';
import { enumKeys } from 'sdutils';
import { PathwayContext } from 'app/context';

export const ADD_PATIENT_MUTATION = gql`
  mutation createPatient($patient: PatientInput!) {
    createPatient(input: $patient) {
      userErrors {
        message
        field
      }
      patient {
        id
      }
    }
  }
`;

interface FormValues {
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  communicationMethod: string;
  dateOfBirth: Date;
}

const NewPatientPage = (): JSX.Element => {
  const newPatientSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    hospitalNumber: yup.string().required(),
    nationalNumber: yup.string().required(),
    communicationMethod: yup.string().required(),
    dateOfBirth: yup.date().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
  } = useForm<FormValues>({ resolver: yupResolver(newPatientSchema) });

  const [addPatient, { data, loading, error }] = useMutation(ADD_PATIENT_MUTATION);
  const { currentPathwayId } = useContext(PathwayContext);

  const useSubmit = (mutation: typeof addPatient, values: FormValues) => {
    const ourValues = {
      ...values,
      dateOfBirth: new Date(values.dateOfBirth),
      pathwayId: currentPathwayId?.toString(),
    };
    console.log(ourValues);
    mutation({
      variables: {
        patient: ourValues,
      },
    });
  };

  const commMethodKeys = enumKeys(PatientCommunicationMethods);
  const commMethodOptions = commMethodKeys.map(
    (k) => <option value={ k } key={ `commMethod-${k}` }>{ PatientCommunicationMethods[k] }</option>,
  );

  const errorElements: JSX.Element[] = data?.userErrors?.map(
    (e: any) => <p key={ e.field }>{ `Field: ${e.field} Message: ${e.message}` }</p>,
  );

  console.log(data?.userErrors);

  return (
    <div>
      <div>
        <section>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
                <form className="card-body p-5" onSubmit={ handleSubmit(() => { useSubmit(addPatient, getValues()); }) }>
                  <div className="form-group mb-2">
                    <h5>Please enter details below to add a new patient</h5>
                  </div>

                  <p>{ data?.patient?.id ? 'Patient Added!' : '' }</p>

                  <div className="form-group row mb-2">
                    <label className="col-md-8 col-form-label" htmlFor="firstName">First name
                      <input type="text" id="firstName" className="form-control" placeholder="John" { ...register('firstName', { required: true }) } />
                      <p>{ formErrors.firstName?.message }</p>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-md-8 col-form-label" htmlFor="lastName">Last name
                      <input type="text" id="lastName" className="form-control" placeholder="Doe" { ...register('lastName', { required: true }) } />
                      <p>{ formErrors.lastName?.message }</p>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-md-8 col-form-label" htmlFor="hospitalNumber">Hospital number
                      <input type="text" className="form-control" id="hospitalNumber" placeholder="MRN1234567" { ...register('hospitalNumber', { required: true }) } />
                      <p>{ formErrors.hospitalNumber?.message }</p>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-md-8 col-form-label" htmlFor="nationalNumber">NHS number
                      <input type="text" className="form-control" id="nationalNumber" placeholder="NHS1234567" { ...register('nationalNumber', { required: true }) } />
                      <p>{ formErrors.hospitalNumber?.message }</p>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-6 col-md-4 col-form-label" htmlFor="dateOfBirth">Date of birth
                      <input type="date" className="form-control" id="dateOfBirth" placeholder="01/01/1970" { ...register('dateOfBirth', { required: true }) } />
                      <p>{ formErrors.dateOfBirth?.message }</p>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-md-8 col-form-label" htmlFor="communicationMethod">Communication Method
                      <select className="form-select" id="communicationMethod" placeholder="NHS1234567" { ...register('communicationMethod', { required: true }) }>
                        { commMethodOptions }
                      </select>
                      <p>{ formErrors.communicationMethod?.message }</p>
                    </label>
                  </div>

                  <div className="float-start">
                    { error }
                    {
                      loading
                        ? 'Loading'
                        : ''
                    }
                    { errorElements }
                    {
                      data
                        ? 'Success!'
                        : ''
                    }
                  </div>
                  <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Register patient</button>
                  <Link to="/home" className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewPatientPage;
