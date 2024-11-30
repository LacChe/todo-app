import { IonInput, IonModal } from '@ionic/react';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ProjectListType, ProjectType } from '../types';
import { setPreference } from '../dataRetrieval';

interface AddProjectModalProps {
  setProjectList: Dispatch<SetStateAction<ProjectListType | undefined>>;
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ setProjects, setProjectList }) => {
  const addProjectModal = useRef<HTMLIonModalElement>(null);

  let [newProjectName, setNewProjectName] = useState<string>('');

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
  );
};

export default AddProjectModal;
