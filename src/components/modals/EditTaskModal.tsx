import { IonAlert, IonButton, IonIcon, IonInput, IonModal, IonTextarea, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Context } from '../../dataManagement/ContextProvider';
import { checkmark, close } from 'ionicons/icons';
import { StatusType, TaskType, TaskTypeDataType } from '../../types';

const EditTaskModal: React.FC = () => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const { getTask, setTask, deleteTask, currentTaskId } = useContext(Context);

  let retrievedTask: TaskType = getTask(currentTaskId);
  const [newTaskName, setNewTaskName] = useState<string>(retrievedTask?.name);
  const [newTaskStatus, setNewTaskStatus] = useState<StatusType>(retrievedTask?.status);
  const [newTaskNotes, setNewTaskNotes] = useState<string>(retrievedTask?.notes);
  const [newTaskTypeData, setNewTaskTypeData] = useState<TaskTypeDataType>(retrievedTask?.typeData);

  useEffect(() => {
    loadData();
  }, [currentTaskId]);

  /**
   * Retrieves the task with the given ID and updates the state
   * with the task's name, status, notes, and typeData.
   * Called when the modal is opened and when the task ID changes.
   */
  async function loadData() {
    retrievedTask = getTask(currentTaskId);
    setNewTaskName(retrievedTask?.name);
    setNewTaskStatus(retrievedTask?.status);
    setNewTaskNotes(retrievedTask?.notes);
    setNewTaskTypeData(retrievedTask?.typeData);
  }

  /**
   * Edits the task with the given ID with the given name, status, notes, and typeData.
   * If the new task name is empty, does nothing.
   * After editing, dismisses the modal.
   */
  function handleEditTask() {
    // TODO check values
    if (!newTaskName || newTaskName === '') return;

    retrievedTask.name = newTaskName;
    retrievedTask.status = newTaskStatus;
    retrievedTask.notes = newTaskNotes;
    retrievedTask.typeData = newTaskTypeData;
    setTask(retrievedTask);

    editProjectModal.current?.dismiss();
  }

  /**
   * Deletes the task with the given ID and then dismisses the modal.
   */
  function handleDeleteTask() {
    deleteTask(currentTaskId);
    editProjectModal.current?.dismiss();
  }

  /**
   * Handles the submission of the edit task form by calling handleEditTask()
   * and then dismissing the modal.
   *
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleEditTask();
    editProjectModal.current?.dismiss();
  }

  return (
    <IonModal
      ref={editProjectModal}
      className="edit-task-modal"
      trigger="open-edit-task-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form onSubmit={handleSubmit} className="edit-task-modal-form">
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
            placeholder="Task Name"
            value={newTaskName}
            onIonInput={(e) => setNewTaskName(e.detail.value as string)}
          />
          {/* Status Input temp */}
          <div>{newTaskStatus}</div>
          {/* Notes Input */}
          <IonTextarea
            label="Notes"
            placeholder="Task Notes"
            value={newTaskNotes}
            onIonInput={(e) => setNewTaskNotes(e.detail.value as string)}
          />
          {/* TypeData Input temp */}
          <div>{JSON.stringify(newTaskTypeData)}</div>
          <IonAlert
            header={`Delete task ${newTaskName}?`}
            trigger="present-delete-confirmation"
            buttons={[
              {
                text: 'Cancel',
              },
              {
                text: 'Delete',
                role: 'confirm',
                handler: handleDeleteTask,
              },
            ]}
          ></IonAlert>
        </div>
      </form>
    </IonModal>
  );
};

export default EditTaskModal;
