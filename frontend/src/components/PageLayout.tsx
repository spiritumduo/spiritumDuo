/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
// import Header from 'components/Header';
import { Footer, Header, Select } from 'nhsuk-react-components';
import Notification from 'components/Notification';
import { AuthContext, PathwayContext } from 'app/context';
import './pagelayout.css';
import sdInvertedImage from '../static/i/sd_inverted.png';

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
          <a href="/app"><img src={ sdInvertedImage } alt="Spiritum Duo logo" className="nhsuk-header__logo" height="40px" /></a>
          <Header.Content>
            <Header.MenuToggle />
            <Header.Search />
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
      {children}
      <Footer>
        <Footer.List>
          <Footer.ListItem href="/">Landing page</Footer.ListItem>
        </Footer.List>
      </Footer>
      <Notification />
    </div>
  );
};

export default PageLayout;
