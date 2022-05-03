import React, { useContext, useRef } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { CloseIcon, SearchIcon } from 'nhsuk-react-components';
import { Overlay } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { PathwayContext } from 'app/context';
import SearchResults from './components/SearchResults';
import { patientSearch } from './__generated__/patientSearch';

export const PATIENT_SEARCH_QUERY = gql`
  query patientSearch($query: String!, $pathwayId: ID!) {
      patientSearch(query: $query, pathwayId: $pathwayId) {
          id
          firstName
          lastName
          hospitalNumber
          nationalNumber
      }
  }
`;

interface SearchBarInput {
  searchBarInput: string;
}

export const SearchBar = () => {
  const [searchQuery, { data, loading, error }] = useLazyQuery<patientSearch>(PATIENT_SEARCH_QUERY);
  const { currentPathwayId } = useContext(PathwayContext);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<SearchBarInput>();
  const target = useRef(null);
  const navigate = useNavigate();
  const { ref, ...queryProps } = register('searchBarInput');
  ref(target.current);
  const doSearchSubmit = ({ searchBarInput }: SearchBarInput) => {
    searchQuery({ variables: {
      query: searchBarInput,
      pathwayId: currentPathwayId,
    } });
  };
  const onClickCallback = (hospitalNumber: string) => {
    navigate(`/patient/${hospitalNumber}`);
    searchQuery();
  };

  const displayResults = data?.patientSearch.length !== 0;

  return (
    <form
      className="nhsuk-header__search-form"
      role="search"
      onSubmit={ handleSubmit( () => {
        doSearchSubmit(getValues());
      }) }
    >
      <label htmlFor="searchBarInput">
        <input className="nhsuk-search__input" id="searchBarInput" ref={ target } { ...queryProps } />
        <span className="nhsuk-u-visually-hidden">Search</span>
        <Overlay target={ target.current } show={ displayResults } placement="bottom">
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              { ...props }
              style={ {
                position: 'absolute',
                ...props.style,
              } }
            >
              {
                data
                  ? (
                    <SearchResults
                      results={ data.patientSearch }
                      onClickCallback={ onClickCallback }
                    />
                  )
                  : <></>
              }
            </div>
          )}
        </Overlay>
      </label>
      <button className="nhsuk-search__submit" type="submit">
        <SearchIcon />
        <span className="nhsuk-u-visually-hidden">Submit Search</span>
      </button>
      <button className="nhsuk-search__close" type="button">
        <CloseIcon />
        <span className="nhsuk-u-visually-hidden">Close search</span>
      </button>
    </form>
  );
};
