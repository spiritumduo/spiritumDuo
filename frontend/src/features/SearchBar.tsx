import React, { useContext, useRef } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { CloseIcon, SearchIcon } from 'nhsuk-react-components';
import { Overlay } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { PathwayContext } from 'app/context';
import SearchResults from 'features/SearchBar/SearchResults';
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
  query: string;
}

const SearchBar = () => {
  const [searchQuery, { data, loading, error }] = useLazyQuery<patientSearch>(PATIENT_SEARCH_QUERY);
  const { currentPathwayId } = useContext(PathwayContext);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<SearchBarInput>();
  const target = useRef(null);
  const navigate = useNavigate();
  const { ref, ...queryProps } = register('query');
  ref(target.current);
  const doSearchSubmit = ({ query }: SearchBarInput) => {
    searchQuery({ variables: {
      query: query,
      pathwayId: currentPathwayId,
    } });
  };
  const onClickCallback = (hospitalNumber: string) => {
    navigate(`/patient/${hospitalNumber}`);
    searchQuery();
  };

  return (
    <form
      className="nhsuk-header__search-form"
      role="search"
      onSubmit={ handleSubmit( () => {
        doSearchSubmit(getValues());
      }) }
    >
      <input className="nhsuk-search__input" id="searchInput" ref={ target } { ...queryProps } />
      <button className="nhsuk-search__submit" type="submit">
        <SearchIcon />
        <span className="nhsuk-u-visually-hidden">Search</span>
      </button>
      <button className="nhsuk-search__close" type="button">
        <CloseIcon />
        <span className="nhsuk-u-visually-hidden">Close search</span>
      </button>
      <Overlay target={ target.current } show={ data !== undefined } placement="bottom">
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
    </form>
  );
};

export default SearchBar;
