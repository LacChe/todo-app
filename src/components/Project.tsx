import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from '@ionic/react';
import React, { useContext } from 'react';
import { listOutline, gridOutline, calendarNumberOutline } from 'ionicons/icons';
import { Route } from 'react-router';

import ListView from '../pages/taskViews/ListView';
import MatrixView from '../pages/taskViews/MatrixView';
import CalendarView from '../pages/taskViews/CalendarView';

import { useParams } from 'react-router';

import { Context } from '../dataManagement/ContextProvider';

const Project: React.FC = (): JSX.Element => {
  let { projectId } = useParams() as any;
  const router = useIonRouter();
  const { handleSetCurrentTab } = useContext(Context);

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton
          tab="list"
          onClick={() => {
            handleSetCurrentTab('list');
            router.push(`/app/project/${projectId}/list`, 'root', 'replace');
          }}
        >
          <IonIcon icon={listOutline} />
        </IonTabButton>
        <IonTabButton
          tab="matrix"
          onClick={() => {
            handleSetCurrentTab('matrix');
            router.push(`/app/project/${projectId}/matrix`, 'root', 'replace');
          }}
        >
          <IonIcon icon={gridOutline} />
        </IonTabButton>
        <IonTabButton
          tab="calendar"
          onClick={() => {
            handleSetCurrentTab('calendar');
            router.push(`/app/project/${projectId}/calendar`, 'root', 'replace');
          }}
        >
          <IonIcon icon={calendarNumberOutline} />
        </IonTabButton>
      </IonTabBar>

      <IonRouterOutlet>
        <Route exact path="/app/project/:projectId/list" component={ListView} />
        <Route exact path="/app/project/:projectId/matrix" component={MatrixView} />
        <Route exact path="/app/project/:projectId/calendar" component={CalendarView} />
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Project;
