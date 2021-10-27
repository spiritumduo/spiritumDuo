import React from 'react';
import './patient.css';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';

export interface PatientPageProps {
  pageLayoutProps: PageLayoutProps;
  patient: Patient;
  decisions: { date: Date, decision: string }[];
  notes: { date: Date, enteredBy: string, note: string }[];
  messages: { date: Date, enteredBy: string, note: string }[];
}

const PatientPage = ({
  pageLayoutProps, patient, decisions,
  notes, messages,
}: PatientPageProps): JSX.Element => {
  const page = (
    <div>
      <div className="container-lg flex">
        <div className="row decision-row">
          <div className="row">
            <Link to={ `/patient/${patient.patientHospitalNumber}/decisions` }>Previous decision points</Link>
          </div>
          {
            decisions.map((d) => (
              <div className="row justify-content-start" key={ `${patient.id}${d.date}` }>
                <div className="col">
                  <h5>Date</h5>
                  <p>{d.date.toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <h5>Decision</h5>
                  <p>{d.decision}</p>
                </div>
                <div className="col" />
              </div>
            ))
          }
        </div>
        <div className="row notes-row">
          <div className="row">
            <Link to={ `/patient/${patient.patientHospitalNumber}/notes` }>Notes</Link>
          </div>
          {
            notes.map((n) => (
              <div className="row" key={ `${patient.id}${n.date}` }>
                <div className="col">
                  <h5>Date</h5>
                  <p>{n.date.toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <h5>Entered By</h5>
                  <p>{n.enteredBy}</p>
                </div>
                <div className="col">
                  <h5>Note</h5>
                  <p>{n.note}</p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="row messages-row">
          <div className="row">
            <Link to={ `/patient/${patient.patientHospitalNumber}/messages` }>Messages</Link>
          </div>
          {
            messages.map((m) => (
              <div className="row" key={ `${patient.id}${m.date}` }>
                <div className="col">
                  <h5>Date</h5>
                  <p>{m.date.toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <h5>Entered By</h5>
                  <p>{m.enteredBy}</p>
                </div>
                <div className="col">
                  <h5>Note</h5>
                  <p>{m.note}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );

  return PageLayout({
    headerProps: pageLayoutProps.headerProps,
    footerProps: pageLayoutProps.footerProps,
    element: page,
  });
};

export default PatientPage;
