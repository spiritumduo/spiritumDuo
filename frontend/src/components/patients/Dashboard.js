import React, { Fragment } from "react";
import Form from "./Form";
import Patients from "./Patients";

export default function Dashboard() {
  return (
    <Fragment>
      <Form />
      <Patients />
    </Fragment>
  );
}
