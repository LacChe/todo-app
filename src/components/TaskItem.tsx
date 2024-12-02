import { IonItem, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/react';
import React, { useContext } from 'react';
import { Context } from '../dataManagement/ContextProvider';

import './TaskItem.css';

const TaskItem: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { tasks, getTaskById, handleSetTasks } = useContext(Context);

  const task = getTaskById(taskId);
  if (!task) console.error(`Task ID: ${taskId} not found`);

  function handleStatusToggle(e: any) {
    task.status = task.status === 'todo' ? 'done' : 'todo';
    let newTasks = [...tasks];
    newTasks.map((prevTask) => {
      if (prevTask.id === taskId) return task;
      else return prevTask;
    });
    handleSetTasks(newTasks);
    e.target.parentNode.parentNode.close();
  }

  function handleEdit(e: any) {
    e.target.parentNode.parentNode.close();
  }

  return (
    <IonItemSliding>
      {/* start options */}
      <IonItemOptions side="start">
        <IonItemOption onClick={handleStatusToggle} expandable>
          {task.status === 'todo' ? 'Done' : 'To Do'}
        </IonItemOption>
      </IonItemOptions>

      {/* task content */}
      <IonItem className={`${task?.status === 'done' ? 'done' : ''}`}>
        {task?.name} {task?.createdDate} {task?.status} {task?.notes}
      </IonItem>

      {/* end options */}
      <IonItemOptions side="end">
        <IonItemOption onClick={handleEdit} expandable>
          Edit
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default TaskItem;
