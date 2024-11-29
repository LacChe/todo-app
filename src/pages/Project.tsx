import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import React from 'react';
import { triangle, ellipse, square } from 'ionicons/icons';
import { Route } from 'react-router';
import ListView from '../components/taskViews/ListView';
import MatrixView from '../components/taskViews/MatrixView';
import CalendarView from '../components/taskViews/CalendarView';

import { useParams } from 'react-router';
import { TabType } from '../types';

interface ProjectProps {
  setCurrentTab: (tabName: TabType) => Promise<void>;
}

const Project: React.FC<ProjectProps> = ({ setCurrentTab }) => {
  let { projectId } = useParams() as any;

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton
          tab="list"
          href={`/app/project/${projectId}/list`}
          onClick={() => {
            setCurrentTab('list');
          }}
        >
          <IonIcon icon={triangle} />
          <IonLabel>List</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="matrix"
          href={`/app/project/${projectId}/matrix`}
          onClick={() => {
            setCurrentTab('matrix');
          }}
        >
          <IonIcon icon={ellipse} />
          <IonLabel>Matrix</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="calendar"
          href={`/app/project/${projectId}/calendar`}
          onClick={() => {
            setCurrentTab('calendar');
          }}
        >
          <IonIcon icon={square} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonRouterOutlet>
        <Route exact path="/app/project/:projectId/list" component={ListView} />
        <Route
          exact
          path="/app/project/:projectId/matrix"
          component={MatrixView}
        />
        <Route
          exact
          path="/app/project/:projectId/calendar"
          component={CalendarView}
        />
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Project;
