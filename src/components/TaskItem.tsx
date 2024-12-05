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

  function handleStatusToggle(e: any) {
    task.status = task.status === 'todo' ? 'done' : 'todo';
    setTask(task);
    e.target.parentNode.parentNode.close();
  }

  function handleEdit(e: any) {
    setCurrentTaskId(taskId);
    document.getElementById('open-edit-task-modal')?.click();
    e.target.parentNode.parentNode.close();
  }

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
