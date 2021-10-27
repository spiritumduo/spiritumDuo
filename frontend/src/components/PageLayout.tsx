/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Header, { HeaderProps } from 'components/Header';
import Footer, { FooterProps } from 'components/Footer';

export interface PageLayoutProps {
    headerProps: HeaderProps,
    footerProps: FooterProps,
    element: JSX.Element
}

/**
 * This higher-order component takes an element and returns the element with
 * a Header above and a Footer below.
 *
 * @param {JSX.Element}              element Element to be wrapped
 * @param {WithHeaderAndFooterProps} props Header and Footer props
 * @returns {JSX.Element} Wrapped element with header and footer
 */
const PageLayout = ({
  headerProps,
  footerProps,
  element,
}: PageLayoutProps) => (
  <div>
    <Header { ...headerProps } />
    {element}
    <Footer { ...footerProps } />
  </div>

);

export default PageLayout;
