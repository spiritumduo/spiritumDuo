import React from 'react';
import './patientlist.css';
import ReactPaginate from 'react-paginate';
import Patient from 'types/Patient';
import { PatientLink } from './Link';

/**
 * PatientListDataFn
 *
 * Used to feed data to the Patient list.
 *
 * @param {number} offset The offset to start from
 * @param {number} limit  How much to return from offset
 * @returns data:       The requested data
 *          totalCount: How many patients are in the collection
 */
export type PatientListDataFn = (offset: number, limit: number) => {
  data: Patient[],
  totalCount: number;
};

export interface PatientListProps {
  /**
   * Number of Patients per page
   */
  pageLimit: number;
  /**
   * Total number of patients to in data source
   */
  totalCount: number;
  /**
   * Function to update patient data
   */
  updateData: PatientListDataFn;
}

type PatientListState = {
  data: Patient[];
  pageCount: number;
};

/**
 * List of patients with pagination
 *
 * This is a class because it has to maintain the pagination state
 */
class PatientList extends React.Component<PatientListProps, PatientListState> {
  constructor(props: PatientListProps) {
    super(props);
    const response = props.updateData(0, props.pageLimit);
    const pageCount = Math.ceil(response.totalCount / props.pageLimit);
    this.state = {
      data: response.data as Patient[],
      pageCount: pageCount as number,
    } as PatientListState;
  }

  handlePageClick(item: { selected: number }): void {
    const { pageLimit, updateData } = this.props;
    const offset = item.selected * pageLimit;
    const limit = (item.selected + 1) * pageLimit;
    const response = updateData(offset, limit);
    const pageCount = Math.ceil(response.totalCount / pageLimit);

    this.setState({
      data: response.data,
      pageCount: pageCount,
    });

    this.render();
  }

  render(): JSX.Element {
    const { data, pageCount } = this.state;
    return (
      <div className="">
        <ul className="patient-list px-0">
          {
            data.map((p) => (
              <li key={ p.patientHospitalNumber }> <PatientLink patient={ p } /> </li>
            ))
          }
        </ul>

        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          breakLabel="..."
          breakClassName="break-me"
          pageCount={ pageCount }
          marginPagesDisplayed={ 2 }
          pageRangeDisplayed={ 5 }
          onPageChange={ this.handlePageClick }
          containerClassName="pagination justify-content-center"
          activeClassName="active"
          pageClassName="page-item"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
        />
      </div>
    );
  }
}

export default PatientList;
