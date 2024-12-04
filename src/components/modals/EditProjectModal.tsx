import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
  IonList,
  IonReorderGroup,
  IonItem,
  IonReorder,
  IonPopover,
  IonAlert,
  useIonRouter,
} from '@ionic/react';
import React, { useContext, useRef, useState } from 'react';

import { checkmark, close, square } from 'ionicons/icons';
import { Context } from '../../dataManagement/ContextProvider';
import { ProjectType, TaskType } from '../../types';

const EditProjectModal: React.FC = () => {
  const router = useIonRouter();
  // TODO temp selection
  const colors = [
    ['#000000', '#FFFFFF', '#FF0000', '#00FF00'],
    ['#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    ['#FFA500', '#800080', '#0000FF', '#FFFF00'],
    ['#FF00FF', '#00FFFF', '#FFA500', '#800080'],
  ];

  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const {
    currentTab,
    projectList,
    handleSetProjectList,
    projects,
    handleSetProjects,
    getProject,
    tasks,
    handleSetTasks,
    currentProjectId,
    handleSetCurrentProjectId,
  } = useContext(Context);

  let retrievedProject: ProjectType = getProject(currentProjectId);

  const [newProjectName, setNewProjectName] = useState<string>(retrievedProject?.name);
  const [newProjectColor, setNewProjectColor] = useState<string>(retrievedProject?.color);
  // const [newProjectBlocks, setNewProjectBlocks] = useState();

  function handleEditProject() {
    // TODO check valid values

    retrievedProject.name = newProjectName;
    retrievedProject.color = newProjectColor;
    // retrievedProject.viewSettings = newProjectBlocks;

    // replace edited project into project list
    let newProjects = projects.map((project: ProjectType) => {
      if (project.id === currentProjectId) return retrievedProject;
      else return project;
    });
    handleSetProjects(newProjects);
  }

  function handleBlockReorder(e: any) {
    console.log('reorder', e);
    e.detail.complete();
  }

  /**
   * Handle the submission of the edit project form by creating a new project
   * and then dismissing the modal.
   *
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleEditProject();
    editProjectModal.current?.dismiss();
  }

  function handleDeleteProject() {
    // remove project from project list
    let newProjectList = { ...projectList };

    newProjectList.projectIds = newProjectList.projectIds.filter((id: string) => id !== currentProjectId);
    handleSetProjectList(newProjectList);

    // reroute to first project if exists or new project page
    if (newProjectList.projectIds[0]) {
      router.push(`/app`, 'root', 'replace');
    } else {
      router.push('/app/project/new', 'root', 'replace');
    }
    handleSetCurrentProjectId(newProjectList.projectIds[0]);

    // delete project
    let newProjects = projects.filter((project: ProjectType) => project.id !== currentProjectId);
    handleSetProjects(newProjects);

    // delete tasks
    let newTasks = tasks.filter((task: TaskType) => !retrievedProject.taskIds.includes(task.id));
    handleSetTasks(newTasks);

    editProjectModal.current?.dismiss();
  }

  return (
    <IonModal
      ref={editProjectModal}
      className="edit-project-modal"
      trigger="open-edit-project-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form onSubmit={handleSubmit} className="edit-project-modal-form">
        <IonToolbar>
          <IonButton type="button" slot="start" id="present-delete-confirmation">
            <IonIcon icon={close} />
          </IonButton>
          <IonButton type="submit" slot="end" onClick={handleSubmit}>
            <IonIcon icon={checkmark} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          {/* Name Input */}
          <IonInput
            label="Name"
            placeholder="Project Name"
            value={newProjectName} // TODO value not set on first load
            onIonInput={(e) => setNewProjectName(e.detail.value as string)}
          />
          {/* Color Input */}
          <div className="form-inputs-color-picker">
            <IonLabel>Color</IonLabel>
            <IonButton id="color-trigger">
              <IonIcon icon={square} />
            </IonButton>
            <IonPopover dismissOnSelect={true} trigger="color-trigger" triggerAction="click">
              <IonContent class="ion-padding color-picker-popover">
                {colors.map((row, index) => {
                  return (
                    <div key={index}>
                      {row.map((color, index) => {
                        return (
                          <button
                            className="color-picker-popover-button"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setNewProjectColor(color);
                            }}
                            key={index}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </IonContent>
            </IonPopover>
          </div>
          {/* Block Editing */}
          <IonLabel>Blocks</IonLabel>
          <IonList className="form-inputs-block-list">
            <IonReorderGroup disabled={false} onIonItemReorder={handleBlockReorder}>
              {[1, 2, 3, 4].map((block, index) => {
                return (
                  <IonItem key={index}>
                    <IonLabel>Item {block}</IonLabel>
                    <IonReorder slot="end"></IonReorder>
                  </IonItem>
                );
              })}
            </IonReorderGroup>
          </IonList>
          <IonAlert
            header={`Delete project ${retrievedProject?.name} and all its tasks?`}
            trigger="present-delete-confirmation"
            buttons={[
              {
                text: 'Cancel',
              },
              {
                text: 'Delete',
                role: 'confirm',
                handler: handleDeleteProject,
              },
            ]}
          ></IonAlert>
        </div>
      </form>
    </IonModal>
  );
};

export default EditProjectModal;
