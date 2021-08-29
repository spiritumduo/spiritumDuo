import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addPatient } from "../../actions/patients";

export class Form extends Component {
  state = {
    firstName: "",
    lastName: "",
    hospitalNumber: "",
    nationalPatientNumber: "",
    DOB: "",
  };

  static propTypes = {
    addPatient: PropTypes.func.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    const { firstName, lastName, hospitalNumber, nationalPatientNumber, DOB } =
      this.state;
    const patient = {
      firstName,
      lastName,
      hospitalNumber,
      nationalPatientNumber,
      DOB,
    };
    this.props.addPatient(patient);
    // this.setState({
    //   firstName: "",
    //   lastName: "",
    //   hospitalNumber: "",
    //   nationalPatientNumber: "",
    //   DOB: "",
    // });
  };

  render() {
    const { firstName, lastName, hospitalNumber, nationalPatientNumber, DOB } =
      this.state;

    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add patient</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>First name</label>
            <input
              className="form-control"
              type="text"
              name="firstName"
              onChange={this.onChange}
              value={firstName}
            />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input
              className="form-control"
              type="text"
              name="lastName"
              onChange={this.onChange}
              value={lastName}
            />
          </div>
          <div className="form-group">
            <label>MRN</label>
            <input
              className="form-control"
              type="text"
              name="hospitalNumber"
              onChange={this.onChange}
              value={hospitalNumber}
            />
          </div>
          <div className="form-group">
            <label>NHS number</label>
            <input
              className="form-control"
              type="text"
              name="nationalPatientNumber"
              onChange={this.onChange}
              value={nationalPatientNumber}
            />
          </div>
          <div className="form-group">
            <label>Date of birth</label>
            <input
              className="form-control"
              type="text"
              name="DOB"
              onChange={this.onChange}
              value={DOB}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { addPatient })(Form);
