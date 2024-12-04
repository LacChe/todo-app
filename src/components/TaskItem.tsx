import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from '@ionic/react';
import React, { useContext } from 'react';
import { Context } from '../dataManagement/ContextProvider';

import './TaskItem.css';
import { TaskType } from '../types';

const TaskItem: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { tasks, getTaskById, handleSetTasks, setCurrentTaskId } = useContext(Context);

  const task = getTaskById(taskId);
  if (!task) {
    // console.error(`Task ID: ${taskId} not found`);
    return <></>;
  }

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
    setCurrentTaskId(taskId);
    document.getElementById('open-edit-task-modal')?.click();
    e.target.parentNode.parentNode.close();
  }

  function toggleShowDetailsOverride() {
    let newTasks = tasks.map((task: TaskType) =>
      task.id === taskId
        ? {
            ...task,
            showDetailsOverride: !task.showDetailsOverride,
          }
        : task,
    );
    handleSetTasks(newTasks);
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
      <IonItem onClick={toggleShowDetailsOverride} className={`${task?.status === 'done' ? 'done' : ''}`}>
        <IonLabel>
          <div>{task?.name}</div>
          {task.showDetailsOverride && (
            <div>
              {task?.createdDate} {task?.status} {task?.notes}
            </div>
          )}
        </IonLabel>
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
