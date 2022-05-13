import React from 'react';
import { SearchIcon } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'app/hooks';
import { setQuery } from './SearchBar.slice';

interface SearchBarInput {
  searchBarInput: string;
}

const SearchBar = () => {
  const { register, handleSubmit, getValues } = useForm<SearchBarInput>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const doSearchSubmit = ({ searchBarInput }: SearchBarInput) => {
    dispatch(setQuery(searchBarInput));
    navigate('/patients/all');
  };

  return (
    <form
      className="nhsuk-header__search-form"
      role="search"
      onSubmit={ handleSubmit( () => {
        doSearchSubmit(getValues());
      }) }
    >
      <label htmlFor="searchBarInput">
        <input className="nhsuk-search__input" id="searchBarInput" { ...register('searchBarInput') } />
        <span className="nhsuk-u-visually-hidden">Search</span>
      </label>
      <button className="nhsuk-search__submit" type="submit">
        <SearchIcon />
        <span className="nhsuk-u-visually-hidden">Submit Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
