import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import React from 'react';
import { triangle, ellipse } from 'ionicons/icons';
import { Route } from 'react-router';
import tab1 from './tab1';
import tab2 from './tab2';

import { useParams } from 'react-router';

type ProjectProps = {
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
};

const Project: React.FC<ProjectProps> = ({ setCurrentTab }) => {
  let { projectId } = useParams() as any;

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton
          tab="tab1"
          href={`/app/project/${projectId}/tab1`}
          onClick={() => {
            setCurrentTab('tab1');
          }}
        >
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="tab2"
          href={`/app/project/${projectId}/tab2`}
          onClick={() => {
            setCurrentTab('tab2');
          }}
        >
          <IonIcon icon={ellipse} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonRouterOutlet>
        <Route exact path="/app/project/:projectId/tab1" component={tab1} />
        <Route exact path="/app/project/:projectId/tab2" component={tab2} />
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Project;
