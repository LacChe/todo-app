import {
  IonContent,
  IonHeader,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';
import Project from '../pages/Project';
import Settings from '../pages/Settings';

import { ProjectType, ProjectListType } from '../types';
import { getProjects, getProjectList, getUserId } from '../dataRetrieval';

const Menu: React.FC = () => {
  // TODO set current tab in preferences and save, load from storage
  let [currentProjectId, setCurrentProjectId] = useState<string>('proj-0000');
  let [currentTab, setCurrentTab] = useState<string>('list');

  const [projectList, setProjectList] = useState<ProjectListType>();

  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_DATA_MODE) {
      // TODO error checking
      const retrievedProjectList = getProjectList(getUserId());
      setProjectList(retrievedProjectList);
      const retrievedProjects = getProjects(getUserId());
      setProjects(retrievedProjects);
    } else {
      console.log(2);
    }
  }, []);

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar color={'secondary'}>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonMenuToggle autoHide={false}>
              <IonItem routerLink="/app/settings" routerDirection="none">
                Settings
              </IonItem>
            </IonMenuToggle>

            {projectList?.projectIds.map((projectId, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  routerLink={`/app/project/${projectId}/${currentTab}`}
                  routerDirection="none"
                >
                  {
                    projects.filter((project) => project.id === projectId)[0]
                      .name
                  }
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Route
            path={`/app/project/:projectId/${currentTab}`}
            render={() => {
              return <Project setCurrentTab={setCurrentTab} />;
            }}
          />
          <Route exact path="/app/settings" component={Settings} />
          <Route exact path="/app">
            <Redirect to={`/app/project/${currentProjectId}/${currentTab}`} />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
