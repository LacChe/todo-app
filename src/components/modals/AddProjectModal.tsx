import { IonButton, IonInput, IonModal, useIonRouter } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ProjectType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';

const AddProjectModal: React.FC = () => {
  const addProjectModal = useRef<HTMLIonModalElement>(null);
  const router = useIonRouter();
  const {
    projects,
    projectList,
    handleSetProjects,
    handleSetProjectList,
    handleSetCurrentProjectId,
    handleSetCurrentTab,
  } = useContext(Context);

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
      color: '#000000',
      taskIds: [],
      viewSettings: {},
    };

    // add new project to project list
    let newProjects = [...projects];
    newProjects.push(newProject);
    handleSetProjects(newProjects);

    // add new id to project list
    let newProjectList;
    if (!projectList) {
      newProjectList = {
        id: 'list-' + uuidv4(),
        projectIds: [],
      };
    } else {
      newProjectList = { ...projectList };
    }
    // this set state is running twice, check duplicate before push
    if (!newProjectList.projectIds.includes(newProject.id)) newProjectList.projectIds.push(newProject.id);
    handleSetProjectList(newProjectList);

    setNewProjectName('');
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
