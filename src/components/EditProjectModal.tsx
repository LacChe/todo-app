import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
  useIonPopover,
  IonList,
  IonReorderGroup,
  IonItem,
  IonReorder,
} from '@ionic/react';
import React, { useContext, useRef, useState } from 'react';

import { checkmark, close, square } from 'ionicons/icons';
import { Context } from '../dataManagement/ContextProvider';
import { ProjectType } from '../types';

const EditProjectModal: React.FC = () => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const { projects, handleSetProjects, getProject, currentProjectId } = useContext(Context);

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

  function colorPickerPopover(setColor: { (value: React.SetStateAction<string>): void; (arg0: string): void }) {
    const colors = [
      ['#000000', '#FFFFFF', '#FF0000', '#00FF00'],
      ['#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      ['#FFA500', '#800080', '#0000FF', '#FFFF00'],
      ['#FF00FF', '#00FFFF', '#FFA500', '#800080'],
    ];
    return (
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
                      setColor(color);
                    }}
                    key={index}
                  />
                );
              })}
            </div>
          );
        })}
      </IonContent>
    );
  }
  const [presentPopover] = useIonPopover(colorPickerPopover(setNewProjectColor));

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
          <IonButton
            type="button"
            slot="start"
            onClick={() => {
              console.log('delete');
              // editProjectModal.current?.dismiss();
            }}
          >
            <IonIcon icon={close} />
          </IonButton>
          <IonButton
            type="submit"
            slot="end"
            onClick={() => {
              console.log('save');
              // editProjectModal.current?.dismiss();
            }}
          >
            <IonIcon icon={checkmark} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          <IonInput
            label="Name"
            placeholder="Project Name"
            value={newProjectName}
            onIonInput={(e) => setNewProjectName(e.detail.value as string)}
          />
          <div className="form-inputs-color-picker">
            <IonLabel>Color</IonLabel>
            <IonButton onClick={(e: any) => presentPopover({ event: e })}>
              <IonIcon icon={square} />
            </IonButton>
          </div>
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
        </div>
      </form>
    </IonModal>
  );
};

export default EditProjectModal;
