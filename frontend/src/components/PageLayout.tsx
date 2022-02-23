/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import Header from 'components/Header';
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
      <Header
        pathwayOptions={ pathwayOptions }
        currentPathwayId={ actualCurrentPathwayId }
        pathwayOnItemSelect={ () => console.log('item selected') }
        searchOnSubmit={ () => console.log('search submit') }
        usersName={ `${user?.firstName} ${user?.lastName}` }
      />
      {children}
      <Notification />
    </div>
  );
};

export default PageLayout;
