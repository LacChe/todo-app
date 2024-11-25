import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { triangle, ellipse } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import tab1 from './tab1';
import tab2 from './tab2';

const Project: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/project/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/app/project/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonRouterOutlet>
        <Route path="/app/project/tab1" component={tab1} />
        <Route path="/app/project/tab2" component={tab2} />

        <Route exact path="/app/project">
          <Redirect to="/app/project/tab1" />
        </Route>
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Project;
