import React, { useState } from 'react';
import { Header, SearchIcon, Container } from 'nhsuk-react-components';
import { BsThreeDots } from 'react-icons/bs';

import User from 'types/Users';
import PathwaySelector from 'components/PathwaySelector';
import sdInvertedImage from 'static/i/sd_inverted.png';
import SearchBar from 'features/SearchBar';

import './SdHeader.css';

export interface SdHeaderProps {
  currentPathwayId?: string;
  pathwayOnItemSelect: (name: string) => void;
  searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
  user?: User;
}

const SdHeader = ({
  currentPathwayId, pathwayOnItemSelect, searchOnSubmit, user,
}: SdHeaderProps): JSX.Element => {
  const currentOption = user?.pathways?.find(
    (p) => p.id.toString() === currentPathwayId?.toString(),
  );
  const hasPathways = !!user?.pathways?.[0];
  const [searchState, setSearchState] = useState(false);
  const [navbarState, setNavbarState] = useState(false);
  return (
    <Header>
      <Header.Container>
        <a href="/app" className="me-2"><img src={ sdInvertedImage } alt="Spiritum Duo logo" className="nhsuk-header__logo" height="40px" /></a>
        <button
          type="button"
          className={ `nhsuk-header__menu-toggle position-relative float-end ms-1 ${navbarState ? 'is-active' : ''}` }
          style={ { width: '40px', height: '40px', padding: '0', right: '0' } }
          aria-label="Open search"
          aria-expanded={ navbarState ? 'true' : 'false' }
          onClick={ () => setNavbarState(!navbarState) }
          disabled={ !hasPathways }
        >
          <BsThreeDots />
        </button>
        <button
          type="button"
          className={ `nhsuk-header__search-toggle float-end p-0 mx-1 position-relative ${searchState ? 'is-active' : ''}` }
          style={ { height: '40px', width: '40px' } }
          aria-label="Open search"
          aria-expanded={ searchState ? 'true' : 'false' }
          onClick={ () => setSearchState(!searchState) }
          disabled={ !hasPathways }
        >
          <SearchIcon />
          <span className="nhsuk-u-visually-hidden">Search</span>
        </button>
        <PathwaySelector
          options={ user?.pathways }
          currentOption={ currentOption }
          onItemSelect={ (name) => { pathwayOnItemSelect(name); } }
        />
        <div className="nhsuk-header__search" aria-disabled>
          <div className={ `nhsuk-header__search-wrap ${searchState ? 'js-show' : ''}` }>
            { hasPathways ? <SearchBar /> : '' }
          </div>
        </div>
      </Header.Container>
      <nav className={ `nhsuk-header__navigation ${navbarState ? 'js-show' : ''}` }>
        <Container>
          <p className="nhsuk-header__navigation-title">
            <span>Menu</span>
          </p>
          <ul className="nhsuk-header__navigation-list">
            {
              hasPathways
                ? (
                  <>
                    <li className="nhsuk-header__navigation-item">
                      <a className="nhsuk-header__navigation-link" style={ { fontSize: '1.1875rem' } } href="/app">Home</a>
                    </li>
                    <li className="nhsuk-header__navigation-item">
                      <a className="nhsuk-header__navigation-link" style={ { fontSize: '1.1875rem' } } href="#mdt">MDT</a>
                    </li>
                    <li className="nhsuk-header__navigation-item">
                      <a className="nhsuk-header__navigation-link" style={ { fontSize: '1.1875rem' } } href="#add-patient">Add Patient</a>
                    </li>
                  </>
                ) : ''
            }
            {
              user?.roles?.find((r) => r.name === 'admin')
                ? (
                  <li className="nhsuk-header__navigation-item">
                    <a className="nhsuk-header__navigation-link" style={ { fontSize: '1.1875rem' } } href="/app/admin">Administration</a>
                  </li>
                )
                : <></>
            }
            <li className="nhsuk-header__navigation-item">
              <a className="nhsuk-header__navigation-link" style={ { fontSize: '1.1875rem' } } href="logout">Logout ({`${user?.firstName} ${user?.lastName}`})</a>
            </li>
          </ul>
        </Container>
      </nav>
    </Header>
  );
};

export default SdHeader;
