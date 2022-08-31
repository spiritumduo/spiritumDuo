import React, { useState, useContext } from 'react';
import { Breadcrumb, Container } from 'nhsuk-react-components';
import { PathwayContext } from 'app/context';
import MDT from 'types/MDT';
import MDTList from 'features/MDTList/MDTList';

const MDTPage = () => {
  const [selectedMdt, setSelectedMdt] = useState<MDT | null>(null);
  const { currentPathwayId } = useContext(PathwayContext);

  return (
    <Container>
      <Breadcrumb style={ { backgroundColor: 'transparent' } }>
        <Breadcrumb.Item
          onClick={ () => {
            setSelectedMdt(null);
          } }
          href="#"
        >
          MDT list
        </Breadcrumb.Item>
        {
          selectedMdt ? (
            <Breadcrumb.Item href="#">
              Patient list
            </Breadcrumb.Item>
          ) : null
        }
      </Breadcrumb>
      <MDTList
        pathwayId={ currentPathwayId || '0' }
        selectedMdt={ selectedMdt }
        setSelectedMdt={ setSelectedMdt }
      />
    </Container>
  );
};

export default MDTPage;
