import { IonButton, IonInput, IonModal, useIonRouter } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ProjectType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';

const AddProjectModal: React.FC = () => {
  const addProjectModal = useRef<HTMLIonModalElement>(null);
  const router = useIonRouter();
  const { setProject, handleSetCurrentProjectId, handleSetCurrentTab } = useContext(Context);

  const [newProjectName, setNewProjectName] = useState<string>('');

  // set focus to input when displayed
  useEffect(() => {
    const modal = addProjectModal.current;
    modal?.addEventListener('didPresent', () => {
      const input = modal.querySelector('ion-input');
      input?.setFocus();
    });
  }, []);

  /**
   * Creates a new project with default settings and adds it to the context.
   * Clears the input state and sets the current project and tab preferences.
   * Redirects the user to the new project's list view.
   */
  function handleCreateNewProject() {
    // TODO check valid name
    if (!newProjectName || newProjectName === '') return;

    // create new project
    const newProject: ProjectType = {
      id: 'proj-' + uuidv4(),
      name: newProjectName,
      color: '#000000',
      taskIds: [],
      viewSettings: {
        listSettings: {
          settings: {
            showDetails: false,
            showDone: false,
            sort: '', // TODO set to default
            group: '', // TODO set to default
          },
        },
        matrixSettings: {
          blocks: [
            // TODO setup default names and colors
            { name: 'block-1', taskIds: [], color: '#E12330' },
            { name: 'block-2', taskIds: [], color: '#1D2A90' },
            { name: 'block-3', taskIds: [], color: '#CB69BC' },
            { name: 'block-4', taskIds: [], color: '#1E8351' },
          ],
          settings: {
            showDetails: false,
            showDone: false,
          },
        },
        calendarSettings: {
          dateContainer: {},
          settings: {
            showDetails: false,
            showDone: false,
          },
        },
      },
    };

    // set in context
    setProject(newProject);

    // clear input states
    setNewProjectName('');

    // set preferences and reroute
    handleSetCurrentProjectId(newProject.id);
    handleSetCurrentTab('list');
    router.push(`/app/project/${newProject.id}/list`, 'root', 'replace');
  }

  /**
   * Handle the submission of the edit project form by creating a new project
   * and then dismissing the modal.
   *
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleCreateNewProject();
    addProjectModal.current?.dismiss();
  }

  return (
    <IonModal
      ref={addProjectModal}
      className="add-project-modal"
      trigger="open-add-project-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form onSubmit={handleSubmit} className="add-project-modal-form">
        <IonInput
          label="Name"
          placeholder="Project Name"
          value={newProjectName}
          onIonInput={(e) => setNewProjectName(e.detail.value as string)}
        />
        <IonButton type="submit" onClick={handleSubmit}>
          Save
        </IonButton>
      </form>
    </IonModal>
  );
};

export default AddProjectModal;
