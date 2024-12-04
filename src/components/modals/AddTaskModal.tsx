import { IonButton, IonInput, IonModal } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ProjectType, TaskType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';

const AddTaskModal: React.FC = () => {
  const addProjectModal = useRef<HTMLIonModalElement>(null);
  const { getProject, projects, tasks, currentProjectId, handleSetProjects, handleSetTasks } = useContext(Context);

  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskNotes, setNewTaskNotes] = useState<string>('');

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
  function handleCreateNewTask() {
    // TODO check values
    if (!newTaskName || newTaskName === '') return;

    // create new task
    const newTask: TaskType = {
      id: 'task-' + uuidv4(),
      createdDate: JSON.stringify(new Date()).split('T')[0].slice(1),
      name: newTaskName,
      status: 'todo',
      typeData: { name: 'single' },
      showDetailsOverride: false,
      notes: newTaskNotes,
    };

    // add new task to project and tasks
    let newProject = { ...getProject(currentProjectId) };
    newProject.taskIds.push(newTask.id);
    handleSetProjects(projects.map((project: ProjectType) => (project.id === currentProjectId ? newProject : project)));
    handleSetTasks([...tasks, newTask]);

    setNewTaskName('');
    setNewTaskNotes('');
    // TODO clear others
  }

  /**
   * Handle the submission of the edit project form by creating a new project
   * and then dismissing the modal.
   *
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleCreateNewTask();
    addProjectModal.current?.dismiss();
  }

  return (
    <IonModal
      ref={addProjectModal}
      className="add-task-modal"
      trigger="open-add-task-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form onSubmit={handleSubmit} className="add-task-modal-form">
        <div>
          <IonInput placeholder="What needs doing..." onIonInput={(e) => setNewTaskName(e.detail.value as string)} />
          <IonInput placeholder="Notes" onIonInput={(e) => setNewTaskNotes(e.detail.value as string)} />
        </div>
        <IonButton type="submit" onClick={handleSubmit}>
          Save
        </IonButton>
        {/* add button to change to detailed creation mode */}
      </form>
    </IonModal>
  );
};

export default AddTaskModal;
