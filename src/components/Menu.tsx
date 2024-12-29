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
  IonReorder,
  IonReorderGroup,
  IonRouterOutlet,
  IonRow,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
  useIonRouter,
} from '@ionic/react';
import { addOutline, menuOutline, searchOutline, settingsOutline } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';

import Project from './Project';
import Settings from '../pages/Settings';

import NewProject from '../pages/NewProject';
import AddProjectModal from './modals/AddProjectModal';
import EditProjectModal from './modals/EditProjectModal';
import AddTaskModal from './modals/AddTaskModal';
import { Context } from '../dataManagement/ContextProvider';
import { ProjectType, TaskType } from '../types';
import EditTaskModal from './modals/EditTaskModal';
import { taskOverdue } from '../dataManagement/utils';
import Search from '../pages/Search';
import SortOptionsModal from './modals/SortOptionsModal';
import { localeToString } from '../dataManagement/utils';

import './Menu.css';
import './ModalStyles.css';

// TODO correctly route search and settings while currentTab exists

const Menu: React.FC = () => {
  const router = useIonRouter();
  const {
    loading,
    currentProjectId,
    currentTab,
    projectList,
    projects,
    getTask,
    handleSetCurrentProjectId,
    handleSetProjectList,
    locale,
  } = useContext(Context);

  const [basicTaskInfo, setBasicTaskInfo] = useState<TaskType | undefined>();

  // direct to correct page after loading
  useEffect(() => {
    if (loading) return;
    // redirect to new project page if no preferences
    if (!projectList || !projects || projectList.projectIds.length === 0) {
      router.push('/app/project/new', 'root', 'replace');
    }
    // redirect to first project list view if no preferences
    if (!currentTab || !currentProjectId || currentProjectId === 'search' || currentProjectId === 'settings') {
      router.push(`/app/project/${projects[0].id}/list`, 'root', 'replace');
    }
    // redirect to saved link after finishing loading
    router.push(`/app/project/${currentProjectId}/${currentTab}`, 'root', 'replace');
  }, [loading]);

  /**
   * Get the count of incomplete tasks for a given project.
   *
   * @param {string} projectId - The ID of the project to retrieve tasks from.
   * @returns {number} The number of tasks that are overdue.
   */
  function getIncompleteTasksCount(projectId: string): number {
    if (!projectId) return 0;
    let project = projects.filter((project: ProjectType) => project.id === projectId)[0];
    if (!project) return 0;
    let incompleteTasks = project.taskIds
      .map((id: string) => getTask(id))
      .filter((task: TaskType) => taskOverdue(task, new Date()));
    return incompleteTasks.length;
  }

  /**
   * Handle the project reorder event from the ion-reorder group.
   * This function takes the event, filters out the moved project id from the current project ids,
   * and inserts the moved project id at the correct position in the project ids array.
   * It then updates the context with the new project ids array.
   * @param {CustomEvent<ItemReorderEventDetail>} e - The event emitted by the ion-reorder group.
   */
  function handleListReorder(e: CustomEvent<ItemReorderEventDetail>) {
    // save data to context
    const originalProjectIds = projectList.projectIds;
    if (originalProjectIds === undefined) return;

    let reorderedProjectIds = originalProjectIds?.filter((id: string, index: number) => index !== e.detail.from);
    reorderedProjectIds.splice(e.detail.to, 0, originalProjectIds[e.detail.from]);
    handleSetProjectList({ ...projectList, projectIds: reorderedProjectIds });

    e.detail.complete(projectList?.projectIds);
  }

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main" id="side-menu">
          <IonHeader>
            {/* toolbar with buttons to add project and go to settings */}
            <IonToolbar>
              <IonRow className="ion-padding-end">
                <IonMenuToggle autoHide={false}>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      handleSetCurrentProjectId('settings');
                      router.push('/app/settings', 'root', 'replace');
                    }}
                  >
                    <IonIcon icon={settingsOutline}></IonIcon>
                  </IonButton>
                </IonMenuToggle>
                <IonTitle>{localeToString('projects', locale) as string}</IonTitle>
                <IonMenuToggle autoHide={false}>
                  <IonButton
                    fill="outline"
                    onClick={() => {
                      handleSetCurrentProjectId('search');
                      router.push('/app/search', 'root', 'replace');
                    }}
                  >
                    <IonIcon icon={searchOutline}></IonIcon>
                  </IonButton>
                </IonMenuToggle>
                <IonButton fill="outline" id="open-add-project-modal">
                  <IonIcon icon={addOutline}></IonIcon>
                </IonButton>
              </IonRow>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {/* list all project names */}
            <IonReorderGroup disabled={false} onIonItemReorder={handleListReorder}>
              {projectList?.projectIds.map((projectId: string, index: number) => {
                const project = projects.filter((project: ProjectType) => project.id === projectId)[0];
                return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem className={`${currentProjectId === projectId ? 'selected-project ' : ''}menu-item`}>
                      <IonReorder slot="start">
                        <IonIcon color="primary" icon={menuOutline}></IonIcon>
                      </IonReorder>
                      <IonButton
                        style={{
                          textDecorationColor: project?.color,
                        }}
                        fill="clear"
                        className="project-selection-button"
                        onClick={() => {
                          handleSetCurrentProjectId(projectId);
                          router.push(`/app/project/${projectId}/${currentTab}`, 'root', 'replace');
                        }}
                      >
                        <div style={{ color: project.color }}>{project.name}</div>
                        {getIncompleteTasksCount(projectId) > 0 && (
                          <IonBadge slot="end">{getIncompleteTasksCount(projectId)}</IonBadge>
                        )}
                      </IonButton>
                    </IonItem>
                  </IonMenuToggle>
                );
              })}
            </IonReorderGroup>

            {/* modal to add project */}
            <AddProjectModal />
            {/* modal to edit project */}
            <div id="open-edit-project-modal" />
            <EditProjectModal />
            {/* modal to edit project */}
            <div id="open-add-task-modal" />
            <AddTaskModal setBasicTaskInfo={setBasicTaskInfo} />
            {/* modal to edit project */}
            <div id="open-edit-task-modal" />
            <EditTaskModal basicTaskInfo={basicTaskInfo} setBasicTaskInfo={setBasicTaskInfo} />
            {/* sorting modal*/}
            <div id="open-sort-options-modal" />
            <SortOptionsModal />
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          {/* routes for direct connections */}
          <Route exact path="/app/project/:projectId/list" component={Project} />
          <Route exact path="/app/project/:projectId/matrix" component={Project} />
          <Route exact path="/app/project/:projectId/calendar" component={Project} />
          <Route exact path="/app/project/new" component={NewProject} />
          <Route exact path="/app/settings" component={Settings} />
          <Route exact path="/app/search" component={Search} />

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
