/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
// import Header from 'components/Header';
import { Header, Select } from 'nhsuk-react-components';
import Notification from 'components/Notification';
import { AuthContext, PathwayContext } from 'app/context';
import './pagelayout.css';

export interface PageLayoutProps {
    children?: JSX.Element
}

/**
 * This component takes an element and returns the element with
 * a Header above and a Footer below.
 */
const PageLayout = ({
  children,
}: PageLayoutProps): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { pathwayOptions, currentPathwayId } = useContext(PathwayContext);
  const actualCurrentPathwayId = currentPathwayId || pathwayOptions[0].id;
  return (
    <div>
      {/* <Header
        pathwayOptions={ pathwayOptions }
        currentPathwayId={ actualCurrentPathwayId }
        pathwayOnItemSelect={ () => console.log('item selected') }
        searchOnSubmit={ () => console.log('search submit') }
        usersName={ `${user?.firstName} ${user?.lastName}` }
      /> */}
      <Header>
        <Header.Container>
          <Header.Content>
            <Header.MenuToggle />
            <Header.Search />
          </Header.Content>
        </Header.Container>
        <Header.Nav>
          <Header.NavItem href="/" mobileOnly>
            Home
          </Header.NavItem>
          <Header.NavItem href="">Home</Header.NavItem>
          <Header.NavItem href="mdt">MDT</Header.NavItem>
          <Header.NavItem href="add-patient" disabled>Add Patient</Header.NavItem>
          <Header.NavItem href="logout">Logout ({`${user?.firstName} ${user?.lastName}`})</Header.NavItem>
        </Header.Nav>
      </Header>
      {children}
      <Notification />
    </div>
  );
};

export default PageLayout;
