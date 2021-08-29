import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPatients, deletePatient } from "../../actions/patients";

export class Patients extends Component {
  static propType = {
    patients: PropTypes.array.isRequired,
    getPatients: PropTypes.func.isRequired,
    deletePatient: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getPatients();
  }

  render() {
    return (
      <Fragment>
        <h2>Patients</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>First name</th>
              <th>Last name</th>
              <th>MRN</th>
              <th>NHS number</th>
              <th>Date of birth</th>
              <th>Created on</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.hospitalNumber}</td>
                <td>{patient.nationalPatientNumber}</td>
                <td>{patient.DOB}</td>
                <td>{patient.createdOn}</td>
                <td>
                  <button
                    onClick={this.props.deletePatient.bind(this, patient.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  patients: state.patients.patients,
});

export default connect(mapStateToProps, { getPatients, deletePatient })(
  Patients
);
