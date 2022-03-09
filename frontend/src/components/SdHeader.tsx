/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { Header, SearchIcon, CloseIcon, Container } from 'nhsuk-react-components';
import { List, ThreeDots } from 'react-bootstrap-icons';

import User from '../types/Users';
import PathwayOption from '../types/PathwayOption';
import PathwaySelector from './PathwaySelector';
import sdInvertedImage from '../static/i/sd_inverted.png';

export interface SdHeaderProps {
  pathwayOptions: PathwayOption[];
  currentPathwayId: number;
  pathwayOnItemSelect: (name: string) => void;
  searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
  user?: User;
}

const SdHeader = ({
  pathwayOptions, currentPathwayId, pathwayOnItemSelect, searchOnSubmit, user,
}: SdHeaderProps): JSX.Element => {
  const currentOption = pathwayOptions.find((p) => p.id === currentPathwayId);
  const [searchState, setSearchState] = useState(false);
  const [navbarState, setNavbarState] = useState(false);
  return (
    <Header>
      <Header.Container>
        <a href="/app" className="me-2"><img src={sdInvertedImage} alt="Spiritum Duo logo" className="nhsuk-header__logo" height="40px" /></a>
        <button
          className={`nhsuk-header__menu-toggle position-relative float-end ms-1 ${navbarState ? 'is-active' : ''}`}
          style={{ width: '40px', height: '40px', padding: '0', right: '0' }}
          aria-label="Open search"
          aria-expanded={navbarState ? 'true' : 'false'}
          onClick={() => setNavbarState(!navbarState)}
        >
          <ThreeDots />
        </button>
        <button
          className={`nhsuk-header__search-toggle float-end p-0 mx-1 position-relative ${searchState ? 'is-active' : ''}`}
          style={{ height: '40px', width: '40px' }}
          aria-label="Open search"
          aria-expanded={searchState ? 'true' : 'false'}
          onClick={() => setSearchState(!searchState)}
        >
          <SearchIcon />
          <span className="nhsuk-u-visually-hidden">Search</span>
        </button>
        <PathwaySelector
          options={pathwayOptions}
          currentOption={currentOption}
          onItemSelect={(name) => { pathwayOnItemSelect(name); } }
        />
        <div className="nhsuk-header__search" aria-disabled>
          <div className={`nhsuk-header__search-wrap ${searchState ? 'js-show' : ''}`}>
            <form className="nhsuk-header__search-form" role="search" onSubmit={(e) => searchOnSubmit(e)}>
              <input className="nhsuk-search__input" id="searchInput" disabled />
              <button className="nhsuk-search__submit" type="submit" disabled>
                <SearchIcon />
                <span className="nhsuk-u-visually-hidden">Search</span>
              </button>
              <button className="nhsuk-search__close">
                <CloseIcon />
                <span className="nhsuk-u-visually-hidden">Close search</span>
              </button>
            </form>
          </div>
        </div>
      </Header.Container>
      <nav className={`nhsuk-header__navigation ${navbarState ? 'js-show' : ''}`}>
        <Container>
          <p className="nhsuk-header__navigation-title">
            <span>Menu</span>
          </p>
          <ul className="nhsuk-header__navigation-list">
            <Header.NavItem style={{ fontSize: '1.1875rem' }} href="">Home</Header.NavItem>
            <Header.NavItem style={{ fontSize: '1.1875rem' }} href="mdt">MDT</Header.NavItem>
            <Header.NavItem style={{ fontSize: '1.1875rem' }} href="add-patient" disabled>Add Patient</Header.NavItem>
            <Header.NavItem style={{ fontSize: '1.1875rem' }} href="logout">Logout ({`${user?.firstName} ${user?.lastName}`})</Header.NavItem>
          </ul>
        </Container>
      </nav>
    </Header>
  );
};

export default SdHeader;
