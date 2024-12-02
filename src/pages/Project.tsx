import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from '@ionic/react';
import React, { useContext } from 'react';
import { triangle, ellipse, square, add } from 'ionicons/icons';
import { Route } from 'react-router';

import ListView from '../components/taskViews/ListView';
import MatrixView from '../components/taskViews/MatrixView';
import CalendarView from '../components/taskViews/CalendarView';

import { useParams } from 'react-router';

import { Context } from '../dataManagement/ContextProvider';
import EditProjectModal from '../components/EditProjectModal';
import './Project.css';

const Project: React.FC = (): JSX.Element => {
  let { projectId } = useParams() as any;
  const { handleSetCurrentTab } = useContext(Context);
  const router = useIonRouter();

  return (
    <>
      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => console.log('fab click')}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>

      {/* modal to edit project */}
      <div id="open-edit-project-modal" />
      <EditProjectModal />

      <IonTabs>
        <IonTabBar slot="bottom">
          <IonTabButton
            tab="list"
            href={`/app/project/${projectId}/list`}
            onClick={() => {
              handleSetCurrentTab('list');
              //router.push(`/app/project/${projectId}/list`, 'root', 'replace');
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
              //router.push(`/app/project/${projectId}/matrix`, 'root', 'replace');
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
              //router.push(`/app/project/${projectId}/calendar`, 'root', 'replace');
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
