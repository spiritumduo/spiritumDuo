/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import Notification from 'components/Notification';
import { AuthContext, PathwayContext } from 'app/context';
import ContextMenu from 'features/ContextMenu/ContextMenu';
import html2canvas from 'html2canvas';

import './pagelayout.css';
import SdHeader from './SdHeader';
import SdFooter from './SdFooter';

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
  const { updateCurrentPathwayId } = useContext(PathwayContext);
  const { currentPathwayId } = useContext(PathwayContext);

  async function takeScreenshot() {
    const b64Image = await html2canvas(document.body).then((canvas) => (
      canvas.toDataURL('image/png')
    ));
    return b64Image;
  }

  return (
    <div>
      <ContextMenu
        takeScreenshotFn={ async () => takeScreenshot() }
      />
      <SdHeader
        currentPathwayId={ currentPathwayId || user?.pathways?.[0].id }
        pathwayOnItemSelect={ (pathwayId) => updateCurrentPathwayId(pathwayId) }
        searchOnSubmit={ () => console.log('search submit') }
        user={ user }
      />
      {children}
      <SdFooter />
      {/* <Notification /> */}
    </div>
  );
};

export default PageLayout;
