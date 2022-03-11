import React from 'react';
import { Header } from 'nhsuk-react-components';

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
  return (
    <Header>
      <Header.Container>
        <Header.Content className="float-start w-100">
          <a href="/app"><img src={ sdInvertedImage } alt="Spiritum Duo logo" className="nhsuk-header__logo" height="40px" /></a>
          <Header.Search onSubmit={ (e) => searchOnSubmit(e) } />
          <Header.MenuToggle />
          <PathwaySelector
            options={ pathwayOptions }
            currentOption={ currentOption }
            onItemSelect={ (name) => { pathwayOnItemSelect(name); } }
          />
        </Header.Content>
      </Header.Container>
      <Header.Nav>
        <Header.NavItem href="/" mobileOnly>
          Home
        </Header.NavItem>
        <Header.NavItem style={ { fontSize: '1.1875rem' } } href="">Home</Header.NavItem>
        <Header.NavItem style={ { fontSize: '1.1875rem' } } href="mdt">MDT</Header.NavItem>
        <Header.NavItem style={ { fontSize: '1.1875rem' } } href="add-patient" disabled>Add Patient</Header.NavItem>
        <Header.NavItem style={ { fontSize: '1.1875rem' } } href="logout">Logout ({`${user?.firstName} ${user?.lastName}`})</Header.NavItem>
      </Header.Nav>
    </Header>
  );
};

export default SdHeader;
