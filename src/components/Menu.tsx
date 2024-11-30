import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonRow,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';
import { add, settings } from 'ionicons/icons';
import React, { useEffect, useState, useRef } from 'react';
import { Redirect, Route } from 'react-router';
import { useIonRouter } from '@ionic/react';

import Project from '../pages/Project';
import Settings from '../pages/Settings';

import { ProjectType, ProjectListType, TabType } from '../types';
import { getProjects, getProjectList, getUserId, setPreference, getPreference } from '../dataRetrieval';

import './Menu.css';
import NewProject from '../pages/NewProject';

const Menu: React.FC = () => {
  const router = useIonRouter();
  const addProjectModal = useRef<HTMLIonModalElement>(null);

  // preferences
  let [currentProjectId, setCurrentProjectId] = useState<string>();
  let [currentTab, setCurrentTab] = useState<TabType>();

  // for modal usage
  let [newProjectName, setNewProjectName] = useState<string>('');

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

  /**
   * Create a new project, add it to the project list, save to preferences.
   * It also clears the new project name input after creation.
   */
  function handleCreateNewProject() {
    // TODO check valid name
    if (!newProjectName || newProjectName === '') return;

    // create new project
    const newProject: ProjectType = {
      id: 'proj-' + uuidv4(),
      name: newProjectName,
      color: '000000',
      taskIds: [],
      viewSettings: {},
    };

    // add new project to project list
    setProjects((prev: ProjectType[]) => {
      let newProjects = [...prev];
      newProjects.push(newProject);
      setPreference('localProjects', JSON.stringify(newProjects));
      return newProjects;
    });

    // add new id to project list
    setProjectList((prev: ProjectListType | undefined) => {
      let newProjectList;
      if (!prev) {
        newProjectList = {
          id: 'list-' + uuidv4(),
          projectIds: [],
        };
      } else {
        newProjectList = { ...prev };
      }
      // this set state is running twice, check duplicate before push
      if (!newProjectList.projectIds.includes(newProject.id)) newProjectList.projectIds.push(newProject.id);
      setPreference('localProjectList', JSON.stringify(newProjectList));
      return newProjectList;
    });

    setNewProjectName('');
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
                <IonButton id="open-modal">
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
                  </IonItem>
                </IonMenuToggle>
              );
            })}

            {/* modal to add project TODO move modal out*/}
            <IonModal
              ref={addProjectModal}
              className="add-project-modal"
              trigger="open-modal"
              initialBreakpoint={1}
              breakpoints={[0, 1]}
            >
              <form className="add-project-modal-form">
                <IonInput
                  label="Name"
                  id="add-project-modal-input"
                  placeholder="Project Name"
                  value={newProjectName}
                  onIonInput={(e) => setNewProjectName(e.detail.value as string)}
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateNewProject();
                    addProjectModal.current?.dismiss();
                  }}
                >
                  Save
                </button>
              </form>
            </IonModal>
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
          <Route exact path="/app/project/new" component={NewProject} />
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
