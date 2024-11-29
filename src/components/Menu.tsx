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

import { ProjectType, ProjectListType, TabType } from '../types';
import { getProjects, getProjectList, getUserId, setPreference, getPreference } from '../dataRetrieval';

const Menu: React.FC = () => {
  // TODO set current tab in preferences and save, load from storage
  let [currentProjectId, setCurrentProjectId] = useState<string>('proj-0000');
  let [currentTab, setCurrentTab] = useState<TabType>();

  const [projectList, setProjectList] = useState<ProjectListType>();
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    loadPreferences();
    loadUserData();
  }, []);

  /**
   * Load preferences from storage and set useStates.
   * Set defaults if no preference are found.
   */
  function loadPreferences() {
    getPreference('currentTab').then((retrievedCurrentTab) => {
      setCurrentTab(retrievedCurrentTab ? (retrievedCurrentTab as TabType) : 'list');
    });
  }

  function loadUserData() {
    // TODO error checking
    const retrievedProjectList = getProjectList(getUserId());
    setProjectList(retrievedProjectList);
    const retrievedProjects = getProjects(getUserId());
    setProjects(retrievedProjects);
  }

  /**
   * Set the current tab preference and save it to storage.
   * @param {TabType} tabName - The name of the tab to set as the current tab.
   */
  async function handleSetCurrentTab(tabName: TabType) {
    setCurrentTab(tabName);
    setPreference('currentTab', tabName);
  }

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

            {/* list all project names */}
            {projectList?.projectIds.map((projectId, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={`/app/project/${projectId}/${currentTab}`} routerDirection="none">
                  {projects.filter((project) => project.id === projectId)[0].name}
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          {/* routes for direct connections */}
          <Route
            exact
            path={`/app/project/:projectId/list`}
            render={() => {
              return <Project setCurrentTab={handleSetCurrentTab} />;
            }}
          />
          <Route
            exact
            path={`/app/project/:projectId/matrix`}
            render={() => {
              return <Project setCurrentTab={handleSetCurrentTab} />;
            }}
          />
          <Route
            exact
            path={`/app/project/:projectId/calendar`}
            render={() => {
              return <Project setCurrentTab={handleSetCurrentTab} />;
            }}
          />
          <Route exact path="/app/settings" component={Settings} />

          {/* routes for variable connections */}
          <Route
            path={`/app/project/:projectId/${currentTab ? currentTab : 'list'}`}
            render={() => {
              return <Project setCurrentTab={handleSetCurrentTab} />;
            }}
          />
          <Route exact path="/app">
            <Redirect to={`/app/project/${currentProjectId}/${currentTab ? currentTab : 'list'}`} />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
