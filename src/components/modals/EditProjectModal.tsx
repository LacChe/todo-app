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

import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { Context } from '../../dataManagement/ContextProvider';
import { BlockType, ProjectType } from '../../types';

const EditProjectModal: React.FC = () => {
  const router = useIonRouter();
  // TODO move outside
  const colors = [
    ['#FF5733', '#FF7F0E', '#FFD700', '#32CD32'],
    ['#2CA02C', '#1F77B4', '#00BFFF', '#8A2BE2'],
    ['#9467BD', '#8B0000', '#D2691E', '#FF6347'],
    ['#C71585', '#4B0082', '#0000FF', '#7F7F7F'],
  ];

  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const { projects, setProject, deleteProject, projectList, getProject, currentProjectId, handleSetCurrentProjectId } =
    useContext(Context);

  let retrievedProject: ProjectType = getProject(currentProjectId);

  const [newProjectName, setNewProjectName] = useState<string>(retrievedProject?.name);
  const [newProjectColor, setNewProjectColor] = useState<string>(retrievedProject?.color);
  const [newProjectBlocks, setNewProjectBlocks] = useState<[BlockType, BlockType, BlockType, BlockType]>(
    retrievedProject?.viewSettings.matrixSettings.blocks,
  );

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
    setNewProjectBlocks(retrievedProject?.viewSettings.matrixSettings.blocks);
  }

  /**
   * Edit the current project with the input values, then update the context.
   *
   * If the new project name is empty, do nothing.
   */
  function handleEditProject() {
    if (!newProjectName || newProjectName === '') return;

    // set input values
    retrievedProject.name = newProjectName;
    retrievedProject.color = newProjectColor;
    retrievedProject.viewSettings.matrixSettings.blocks = newProjectBlocks;

    // set to context
    setProject(retrievedProject);
  }

  /**
   * Handles the block reorder event from the ion-reorder group.
   * This function takes the event, filters out the moved block from the current blocks,
   * and inserts the moved block at the correct position in the blocks array.
   * It then updates the context with the new blocks array.
   * @param {any} e - The event emitted by the ion-reorder group.
   */
  function handleBlockReorder(e: any) {
    // save data to context
    const originalBlocks = [...newProjectBlocks];
    if (originalBlocks === undefined || originalBlocks.length === 0) return;

    let reorderedBlocks = originalBlocks?.filter((_, index: number) => index !== e.detail.from);
    reorderedBlocks.splice(e.detail.to, 0, originalBlocks[e.detail.from]);
    setNewProjectBlocks(reorderedBlocks as [BlockType, BlockType, BlockType, BlockType]);

    e.detail.complete(newProjectBlocks);
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

  /**
   * Updates the name of a block at a specified index in the newProjectBlocks state.
   *
   * This function takes an index and a new name value, updates the block at the specified
   * index with the new name, and then updates the state with the modified blocks array.
   *
   * @param {number} index - The index of the block to update.
   * @param {string} value - The new name to assign to the block.
   */
  function handleBlockNameChange(index: number, value: string) {
    const newBlocks: [BlockType, BlockType, BlockType, BlockType] = [...newProjectBlocks];
    newBlocks[index].name = value;
    setNewProjectBlocks(newBlocks);
  }

  /**
   * Updates the color of a block at a specified index in the newProjectBlocks state.
   *
   * This function takes an index and a new color value, updates the block at the specified
   * index with the new color, and then updates the state with the modified blocks array.
   *
   * @param {number} index - The index of the block to update.
   * @param {string} value - The new color to assign to the block.
   */
  function handleBlockColorChange(index: number, value: string) {
    const newBlocks: [BlockType, BlockType, BlockType, BlockType] = [...newProjectBlocks];
    newBlocks[index].color = value;
    setNewProjectBlocks(newBlocks);
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
            <IonIcon icon={closeOutline} />
          </IonButton>
          <IonButton type="submit" slot="end">
            <IonIcon icon={checkmarkOutline} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          {/* Name Input */}
          <IonInput
            labelPlacement="floating"
            label="Name"
            placeholder="Project Name"
            value={newProjectName}
            onIonInput={(e) => setNewProjectName(e.detail.value as string)}
          />
          {/* Color Input */}
          <div className="form-inputs-color-picker">
            <IonLabel>Color</IonLabel>
            <IonButton fill="clear" id="color-trigger">
              <div className="color-picker-popover-button" style={{ backgroundColor: newProjectColor }} />
            </IonButton>
            <IonPopover
              side="left"
              alignment="end"
              dismissOnSelect={true}
              reference="trigger"
              trigger="color-trigger"
              triggerAction="click"
            >
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
              {newProjectBlocks?.map((block, blockIndex) => (
                <IonItem key={blockIndex}>
                  <IonInput
                    value={block.name}
                    onIonChange={(e) => handleBlockNameChange(blockIndex, e.detail.value as string)}
                  />

                  <IonButton fill="clear" id={`color-trigger-${blockIndex}`}>
                    <div className="color-picker-popover-button" style={{ backgroundColor: block.color }} />
                  </IonButton>
                  <IonPopover
                    side="top"
                    alignment="end"
                    dismissOnSelect={true}
                    reference="trigger"
                    trigger={`color-trigger-${blockIndex}`}
                    triggerAction="click"
                  >
                    <IonContent class="ion-padding color-picker-popover">
                      {colors.map((row, colorIndex) => {
                        return (
                          <div key={colorIndex}>
                            {row.map((color, rowIndex) => {
                              return (
                                <button
                                  key={rowIndex}
                                  className="color-picker-popover-button"
                                  style={{ backgroundColor: color }}
                                  onClick={() => {
                                    handleBlockColorChange(blockIndex, color);
                                  }}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </IonContent>
                  </IonPopover>
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
              ))}
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
