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
import React, { useContext, useEffect, useRef, useState } from 'react';

import { checkmark, close, square } from 'ionicons/icons';
import { Context } from '../../dataManagement/ContextProvider';
import { ProjectType } from '../../types';

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
  const { projects, setProject, deleteProject, projectList, getProject, currentProjectId, handleSetCurrentProjectId } =
    useContext(Context);

  let retrievedProject: ProjectType = getProject(currentProjectId);

  const [newProjectName, setNewProjectName] = useState<string>(retrievedProject?.name);
  const [newProjectColor, setNewProjectColor] = useState<string>(retrievedProject?.color);
  // TODO set other values
  // const [newProjectBlocks, setNewProjectBlocks] = useState();

  useEffect(() => {
    loadData();
  }, [currentProjectId, projects]);

  /**
   * Retrieve the current project and set the input values to the retrieved project values.
   *
   * This is called whenever the current project ID changes.
   */
  async function loadData() {
    retrievedProject = getProject(currentProjectId);
    setNewProjectName(retrievedProject?.name);
    setNewProjectColor(retrievedProject?.color);
    // TODO set other values
  }

  /**
   * Edit the current project with the input values, then update the context.
   *
   * If the new project name is empty, do nothing.
   */
  function handleEditProject() {
    // TODO check valid values
    if (!newProjectName || newProjectName === '') return;

    // set input values
    retrievedProject.name = newProjectName;
    retrievedProject.color = newProjectColor;
    // retrievedProject.viewSettings = newProjectBlocks;

    // set to context
    setProject(retrievedProject);
  }

  function handleBlockReorder(e: any) {
    // TODO
    console.log('reorder', e);
    e.detail.complete();
  }

  /**
   * Handle the submission of the edit project form by calling
   * the handleEditProject function and then dismissing the modal.
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleEditProject();
    editProjectModal.current?.dismiss();
  }

  /**
   * Deletes the current project and updates the project list.
   * If the current project is deleted, reroutes to the first project if available,
   * otherwise redirects to the new project creation page.
   * Finally, dismisses the edit project modal.
   */
  async function handleDeleteProject() {
    await deleteProject(currentProjectId);

    // reroute to first project if exists or new project page
    const newProjectList = { ...projectList };
    newProjectList.projectIds = newProjectList.projectIds.filter((id: string) => id !== currentProjectId);
    handleSetCurrentProjectId(newProjectList.projectIds[0]);
    if (newProjectList.projectIds[0]) {
      router.push(`/app`, 'root', 'replace');
    } else {
      router.push('/app/project/new', 'root', 'replace');
    }

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
          <IonButton type="submit" slot="end">
            <IonIcon icon={checkmark} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          {/* Name Input */}
          <IonInput
            label="Name"
            placeholder="Project Name"
            value={newProjectName}
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
          {/* Confirmation Alert for Deleting */}
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
