import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import React, { useContext } from 'react';
import { triangle, ellipse, square, add } from 'ionicons/icons';
import { Route } from 'react-router';

import ListView from '../pages/taskViews/ListView';
import MatrixView from '../pages/taskViews/MatrixView';
import CalendarView from '../pages/taskViews/CalendarView';

import { useParams } from 'react-router';

import { Context } from '../dataManagement/ContextProvider';
import './Project.css';

const Project: React.FC = (): JSX.Element => {
  let { projectId } = useParams() as any;
  const { handleSetCurrentTab } = useContext(Context);

  return (
    <>
      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => console.log('fab click')}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>

      <IonTabs>
        <IonTabBar slot="bottom">
          <IonTabButton
            tab="list"
            href={`/app/project/${projectId}/list`}
            onClick={() => {
              handleSetCurrentTab('list');
            }}
          >
            <IonIcon icon={triangle} />
            <IonLabel>List</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="matrix"
            href={`/app/project/${projectId}/matrix`}
            onClick={() => {
              handleSetCurrentTab('matrix');
            }}
          >
            <IonIcon icon={ellipse} />
            <IonLabel>Matrix</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="calendar"
            href={`/app/project/${projectId}/calendar`}
            onClick={() => {
              handleSetCurrentTab('calendar');
            }}
          >
            <IonIcon icon={square} />
            <IonLabel>Calendar</IonLabel>
          </IonTabButton>
        </IonTabBar>

        <IonRouterOutlet>
          <Route exact path="/app/project/:projectId/list" component={ListView} />
          <Route exact path="/app/project/:projectId/matrix" component={MatrixView} />
          <Route exact path="/app/project/:projectId/calendar" component={CalendarView} />
        </IonRouterOutlet>
      </IonTabs>
    </>
  );
};

export default Project;
