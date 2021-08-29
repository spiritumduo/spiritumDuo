import axios from "axios";

import { GET_PATIENTS, DELETE_PATIENT, ADD_PATIENT } from "./types";

// const apiBaseUrl = process.env.apiBaseUrl;
const apiBaseUrl = "https://www.spiritumduo.com/api";

// GET PATIENTS
export const getPatients = () => (dispatch) => {
  axios
    .get(`${apiBaseUrl}/patient/`)
    .then((res) => {
      dispatch({
        type: GET_PATIENTS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// DELETE PATIENTS
export const deletePatient = (id) => (dispatch) => {
  axios
    .delete(`${apiBaseUrl}/patient/${id}/`)
    .then((res) => {
      dispatch({
        type: DELETE_PATIENT,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD PATIENT
export const addPatient = (patient) => (dispatch) => {
  axios
    .post(`${apiBaseUrl}/patient/`, patient)
    .then((res) => {
      dispatch({
        type: ADD_PATIENT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
