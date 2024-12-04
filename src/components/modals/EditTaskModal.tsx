import { IonAlert, IonButton, IonIcon, IonInput, IonModal, IonTextarea, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Context } from '../../dataManagement/ContextProvider';
import { checkmark, close } from 'ionicons/icons';
import { StatusType, TaskType, TaskTypeDataType } from '../../types';

const EditTaskModal: React.FC = () => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const { getTask, currentTaskId, handleSetTasks, tasks } = useContext(Context);

  let retrievedTask: TaskType = getTask(currentTaskId);
  const [newTaskName, setNewTaskName] = useState<string>(retrievedTask?.name);
  const [newTaskStatus, setNewTaskStatus] = useState<StatusType>(retrievedTask?.status);
  const [newTaskNotes, setNewTaskNotes] = useState<string>(retrievedTask?.notes);
  const [newTaskTypeData, setNewTaskTypeData] = useState<TaskTypeDataType>(retrievedTask?.typeData);

  useEffect(() => {
    loadData();
  }, [currentTaskId]);

  async function loadData() {
    retrievedTask = getTask(currentTaskId);
    setNewTaskName(retrievedTask?.name);
    setNewTaskStatus(retrievedTask?.status);
    setNewTaskNotes(retrievedTask?.notes);
    setNewTaskTypeData(retrievedTask?.typeData);
  }

  function handleEditTask() {
    // TODO check values
    if (!newTaskName || newTaskName === '') return;

    let newTasks = tasks.map((task: TaskType) =>
      task.id === currentTaskId
        ? {
            ...task,
            name: newTaskName,
            status: newTaskStatus,
            notes: newTaskNotes,
            typeData: newTaskTypeData,
          }
        : task,
    );
    handleSetTasks(newTasks);

    editProjectModal.current?.dismiss();
  }

  function handleDeleteTask() {
    console.log('delete');
    editProjectModal.current?.dismiss();
  }

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
