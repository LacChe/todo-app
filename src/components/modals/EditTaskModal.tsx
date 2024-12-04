import { IonAlert, IonButton, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useContext, useRef } from 'react';

import { Context } from '../../dataManagement/ContextProvider';
import { checkmark, close } from 'ionicons/icons';

const EditTaskModal: React.FC = () => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const {} = useContext(Context);

  // let retrievedTask: TaskType = getTask(// id);

  function handleEditTask() {
    console.log('edit');
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
            // onIonInput={(e) => setNewTaskName(e.detail.value as string)}
          />
          <IonAlert
            header={`Delete task ${'"name"' /* TODO task name */} and all its tasks?`}
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
