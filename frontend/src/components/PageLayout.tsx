/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import Header, { HeaderProps } from 'components/Header';
import Footer, { FooterProps } from 'components/Footer';
import './pagelayout.css';
import { AuthContext, PathwayContext } from 'app/context';

export interface PageLayoutProps {
    headerProps: HeaderProps,
    footerProps: FooterProps,
    children?: JSX.Element
}

/**
 * This component takes an element and returns the element with
 * a Header above and a Footer below.
 *
 * @param {HeaderProps} headerProps Header props
 * @param {FooterProps} footerProps Footer props
 * @param {JSX.Element?} children    Element to wrap
 * @returns {JSX.Element} Wrapped element with header and footer
 */
const PageLayout = ({
  headerProps,
  footerProps,
  children,
}: PageLayoutProps): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { pathwayOptions, currentPathwayId } = useContext(PathwayContext);
  const actualCurrentPathwayId = currentPathwayId || headerProps.currentPathwayId;
  return (
    <div>
      <Header
        { ...headerProps }
        pathwayOptions={ pathwayOptions }
        currentPathwayId={ actualCurrentPathwayId }
      />
      {children}
      <Footer name={ `${user?.firstName} ${user?.lastName}` } />
    </div>
  );
};

export default PageLayout;
