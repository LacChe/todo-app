import {
  IonBadge,
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
  useIonRouter,
} from '@ionic/react';
import { add, settings } from 'ionicons/icons';
import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router';

import Project from './Project';
import Settings from '../pages/Settings';

import './Menu.css';
import NewProject from '../pages/NewProject';
import AddProjectModal from './modals/AddProjectModal';
import EditProjectModal from './modals/EditProjectModal';
import AddTaskModal from './modals/AddTaskModal';
import { Context } from '../dataManagement/ContextProvider';
import { ProjectType, TaskType } from '../types';
import EditTaskModal from './modals/EditTaskModal';

const Menu: React.FC = () => {
  const router = useIonRouter();
  const {
    loading,
    currentProjectId,
    currentTab,
    projectList,
    projects,
    getTasksByProjectId,
    handleSetCurrentProjectId,
  } = useContext(Context);

  //direct to correct page after loading
  useEffect(() => {
    if (loading) return;
    // redirect to new project page if no preferences
    if (!projectList || !projects || projectList.projectIds.length === 0) {
      router.push('/app/project/new', 'root', 'replace');
      return;
    }
    // redirect to first project list view if no preferences
    if (!currentTab || !currentProjectId) {
      router.push(`/app/project/${projects[0].id}/list`, 'root', 'replace');
      return;
    }
    // redirect to saved link after finishing loading
    router.push(`/app/project/${currentProjectId}/${currentTab}`, 'root', 'replace');
  }, [loading]);

  function getIncompleteTasksCount(projectId: string) {
    return getTasksByProjectId(projectId).filter((task: TaskType) => task.status !== 'done').length;
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
            {projectList?.projectIds.map((projectId: string, index: number) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem
                    className="menu-item"
                    onClick={() => {
                      handleSetCurrentProjectId(projectId);
                    }}
                    routerLink={`/app/project/${projectId}/${currentTab ? currentTab : 'list'}`}
                    routerDirection="none"
                  >
                    <div>{projects.filter((project: ProjectType) => project.id === projectId)[0].name}</div>
                    {getIncompleteTasksCount(projectId) > 0 && (
                      <IonBadge slot="end">{getIncompleteTasksCount(projectId)}</IonBadge>
                    )}
                  </IonItem>
                </IonMenuToggle>
              );
            })}

            {/* modal to add project */}
            <AddProjectModal />
            {/* modal to edit project */}
            <div id="open-edit-project-modal" />
            <EditProjectModal />
            {/* modal to edit project */}
            <div id="open-add-task-modal" />
            <AddTaskModal />
            {/* modal to edit project */}
            <div id="open-edit-task-modal" />
            <EditTaskModal />
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          {/* routes for direct connections */}
          <Route exact path={`/app/project/:projectId/list`} component={Project} />
          <Route exact path={`/app/project/:projectId/matrix`} component={Project} />
          <Route exact path={`/app/project/:projectId/calendar`} component={Project} />
          <Route exact path="/app/project/new" component={NewProject} />
          <Route exact path="/app/settings" component={Settings} />

          {/* routes for variable connections */}
          <Route path={`/app/project/:projectId/${currentTab ? currentTab : 'list'}`} component={Project} />
          <Route exact path="/app">
            <Redirect to={`/app/project/${currentProjectId}/${currentTab ? currentTab : 'list'}`} />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
