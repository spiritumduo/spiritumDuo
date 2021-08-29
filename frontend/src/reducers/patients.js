import { GET_PATIENTS, DELETE_PATIENT, ADD_PATIENT } from "../actions/types.js";

const initialState = {
  patients: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PATIENTS:
      return {
        ...state,
        patients: action.payload,
      };
    case DELETE_PATIENT:
      return {
        ...state,
        patients: state.patients.filter(
          (patient) => patient.id !== action.payload
        ),
      };
    case ADD_PATIENT:
      return {
        ...state,
        patients: [...state.patients, action.payload],
      };
    default:
      return state;
  }
}
