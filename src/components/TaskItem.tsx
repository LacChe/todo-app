import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from '@ionic/react';
import React, { useContext } from 'react';
import { Context } from '../dataManagement/ContextProvider';

import './TaskItem.css';

const TaskItem: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { getTask, setTask, setCurrentTaskId } = useContext(Context);

  const task = getTask(taskId);
  if (!task) {
    // console.error(`Task ID: ${taskId} not found`);
    return <></>;
  }

  /**
   * Handles the status toggle event.
   *
   * When the status toggle button is clicked, it toggles the task's status
   * between 'todo' and 'done', then updates the task in the context.
   * Finally, it closes the sliding item.
   *
   * @param {any} e - The click event.
   */
  function handleStatusToggle(e: any) {
    task.status = task.status === 'todo' ? 'done' : 'todo';
    setTask(task);
    e.target.parentNode.parentNode.close();
  }

  /**
   * Handle the edit button click event.
   *
   * This function sets the currentTaskId in the context to the ID of the
   * task that was clicked, then opens the edit task modal. It also closes the
   * sliding item.
   *
   * @param {any} e - The click event.
   */
  function handleEdit(e: any) {
    setCurrentTaskId(taskId);
    document.getElementById('open-edit-task-modal')?.click();
    e.target.parentNode.parentNode.close();
  }

  /**
   * Toggles the showDetailsOverride flag on the task.
   *
   * If this flag is set to true, the task's details will be shown
   * regardless of the view settings.
   */
  function toggleShowDetailsOverride() {
    task.showDetailsOverride = !task.showDetailsOverride;
    setTask(task);
  }

  return (
    <IonItemSliding>
      {/* start options */}
      <IonItemOptions side="start">
        <IonItemOption onClick={handleStatusToggle} expandable>
          {task.status === 'todo' ? 'Done' : 'To Do'}
        </IonItemOption>
        <IonItemOption onClick={handleEdit}>Edit</IonItemOption>
      </IonItemOptions>

      {/* task content */}
      <IonItem onClick={toggleShowDetailsOverride} className={`${task?.status === 'done' ? 'done' : ''}`}>
        <IonLabel>
          <div>{taskId}</div>
          <div>{task?.name}</div>
          {task.showDetailsOverride && (
            <div>
              {task?.createdDate} {task?.status} {task?.notes}
            </div>
          )}
        </IonLabel>
      </IonItem>
    </IonItemSliding>
  );
};

export default TaskItem;
