import { IonButton, IonIcon, IonInput, IonModal } from '@ionic/react';
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TaskType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';
import { ellipsisHorizontalOutline, sendOutline } from 'ionicons/icons';

type AddTaskModalProps = {
  setBasicTaskInfo: Dispatch<SetStateAction<TaskType | undefined>>;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ setBasicTaskInfo }) => {
  const addProjectModal = useRef<HTMLIonModalElement>(null);
  const { setTask } = useContext(Context);

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
   * Creates a new task with the given name and notes, assigns it a unique ID,
   * and sets default properties like status and typeData. The new task is then
   * added to the context and input states are cleared.
   */
  function handleCreateNewTask() {
    // TODO check values
    if (!newTaskName || newTaskName === '') return;

    // create new task
    const newTask: TaskType = {
      id: 'task-' + uuidv4(),
      createdDate: JSON.stringify(new Date()).split('T')[0].slice(1),
      name: newTaskName,
      typeData: { name: 'single', completedOnDates: [] },
      showDetailsOverride: false,
      notes: newTaskNotes,
    };

    setNewTaskName('');
    setNewTaskNotes('');

    setTask(newTask);
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
        <div className="add-task-input-wrapper">
          <IonInput placeholder="What needs doing..." onIonInput={(e) => setNewTaskName(e.detail.value as string)} />
          <IonInput placeholder="Notes" onIonInput={(e) => setNewTaskNotes(e.detail.value as string)} />
        </div>
        <div className="add-task-button-wrapper">
          {/* button to change to detailed creation mode */}
          <IonButton
            className="expand-button"
            onClick={() => {
              setBasicTaskInfo({
                id: 'task-' + uuidv4(),
                createdDate: JSON.stringify(new Date()).split('T')[0].slice(1),
                name: newTaskName,
                typeData: { name: 'single', completedOnDates: [] },
                showDetailsOverride: false,
                notes: newTaskNotes,
              });
              addProjectModal.current?.dismiss();
              document.getElementById('open-edit-task-modal')?.click();
            }}
          >
            <IonIcon icon={ellipsisHorizontalOutline}></IonIcon>
          </IonButton>
          <IonButton className="add-button" type="submit" onClick={handleSubmit}>
            <IonIcon icon={sendOutline} />
          </IonButton>
        </div>
      </form>
    </IonModal>
  );
};

export default AddTaskModal;
