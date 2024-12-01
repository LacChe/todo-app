import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonRow,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add, settings } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';
import { useIonRouter } from '@ionic/react';

import Project from '../pages/Project';
import Settings from '../pages/Settings';

import { ProjectType, ProjectListType, TabType } from '../types';
import { getProjects, getProjectList, getUserId, setPreference, getPreference } from '../dataRetrieval';

import './Menu.css';
import NewProject from '../pages/NewProject';
import AddProjectModal from './AddProjectModal';

const Menu: React.FC = () => {
  const router = useIonRouter();

  // preferences
  let [currentProjectId, setCurrentProjectId] = useState<string>();
  let [currentTab, setCurrentTab] = useState<TabType>();

  // user data
  const [projectList, setProjectList] = useState<ProjectListType>();
  const [projects, setProjects] = useState<ProjectType[]>([]);

  // load preferences and user data on first render
  useEffect(() => {
    loadPreferences();
    loadUserData();
  }, []);

  /**
   * Load preferences from storage and set useStates.
   * Set defaults if no preference are found.
   */
  async function loadPreferences() {
    let retrievedCurrentTab = await getPreference('currentTab');
    let retrievedCurrentProjectId = await getPreference('currentProjectId');

    // redirect to new project page if no preferences
    if (!retrievedCurrentTab || !retrievedCurrentProjectId) {
      router.push('/app/project/new', 'root', 'replace');
      return;
    }

    setCurrentTab(retrievedCurrentTab as TabType);
    setCurrentProjectId(retrievedCurrentProjectId as string);
    // redirect to saved link after finising loading
    router.push(`/app/project/${retrievedCurrentProjectId}/${retrievedCurrentTab}`, 'root', 'replace');
  }

  /**
   * Load the user data from storage.
   */
  async function loadUserData() {
    // TODO error checking
    const retrievedProjectList = await getProjectList(getUserId());
    setProjectList(retrievedProjectList);
    const retrievedProjects = await getProjects(getUserId());
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

  /**
   * Set the current project ID preference and save it to storage.
   *
   * @param {string} projectId - The ID of the project to set as the current project.
   */
  async function handleSetCurrentProjectId(projectId: string) {
    setCurrentProjectId(projectId);
    setPreference('currentProjectId', projectId);
  }

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            {/* toolbar with buttons to add project and go to settings */}
            <IonToolbar color={'secondary'}>
              <IonTitle>Menu</IonTitle>
              <IonRow slot="end" className="ion-padding-end">
                <IonButton id="open-add-project-modal">
                  <IonIcon icon={add}></IonIcon>
                </IonButton>
                <IonMenuToggle autoHide={false}>
                  <IonButton routerLink="/app/settings" routerDirection="none">
                    <IonIcon icon={settings}></IonIcon>
                  </IonButton>
                </IonMenuToggle>
              </IonRow>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {/* list all project names */}
            {projectList?.projectIds.map((projectId, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem
                    onClick={() => {
                      handleSetCurrentProjectId(projectId);
                    }}
                    routerLink={`/app/project/${projectId}/${currentTab ? currentTab : 'list'}`}
                    routerDirection="none"
                  >
                    {projects.filter((project) => project.id === projectId)[0].name}
                    {/* TODO show incomplete task count */}
                  </IonItem>
                </IonMenuToggle>
              );
            })}

            {/* modal to add project */}
            <AddProjectModal setProjectList={setProjectList} setProjects={setProjects} />
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          {/* routes for direct connections */}
          <Route
            exact
            path={`/app/project/:projectId/list`}
            render={() => {
              return (
                <Project
                  setCurrentTab={handleSetCurrentTab}
                  setProjectList={setProjectList}
                  setProjects={setProjects}
                />
              );
            }}
          />
          <Route
            exact
            path={`/app/project/:projectId/matrix`}
            render={() => {
              return (
                <Project
                  setCurrentTab={handleSetCurrentTab}
                  setProjectList={setProjectList}
                  setProjects={setProjects}
                />
              );
            }}
          />
          <Route
            exact
            path={`/app/project/:projectId/calendar`}
            render={() => {
              return (
                <Project
                  setCurrentTab={handleSetCurrentTab}
                  setProjectList={setProjectList}
                  setProjects={setProjects}
                />
              );
            }}
          />
          <Route exact path="/app/project/new" component={NewProject} />
          <Route exact path="/app/settings" component={Settings} />

          {/* routes for variable connections */}
          <Route
            path={`/app/project/:projectId/${currentTab ? currentTab : 'list'}`}
            render={() => {
              return (
                <Project
                  setCurrentTab={handleSetCurrentTab}
                  setProjectList={setProjectList}
                  setProjects={setProjects}
                />
              );
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
