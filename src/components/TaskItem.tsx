import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../dataManagement/ContextProvider';

import './TaskItem.css';
import { taskDue, taskOverdue } from '../dataManagement/utils';

const TaskItem: React.FC<{ taskId: string; offsetDays?: number }> = ({
  taskId,
  offsetDays,
}) => {
  const { getTask, setTask, setCurrentTaskId, tasks } = useContext(Context);

  const [taskDueBool, setTaskDueBool] = useState<boolean>(true);
  const [taskOverdueBool, setTaskOverdueBool] = useState<boolean>(true);

  let task = getTask(taskId);
  let shownDate = new Date();

  // init data when tasks change
  useEffect(() => {
    task = getTask(taskId);

    shownDate = new Date();
    if (offsetDays) shownDate.setDate(shownDate.getDate() + offsetDays);
    setTaskDueBool(taskDue(task, shownDate));
    setTaskOverdueBool(taskOverdue(task, shownDate));
  }, [tasks, offsetDays]);

  /**
   * Toggles the completion status of a task for the current day.
   *
   * If the task type is 'single', it will clear the completion dates if
   * there are any, or mark it as completed for today if it's not completed.
   * For other task types, it adds or removes today's date from the
   * completedOnDates array.
   *
   * After updating the task's completion status, it updates the task
   * in the context and closes the sliding item.
   *
   * @param {any} e - The event triggered by the status toggle action.
   */
  function handleStatusToggle(e: any) {
    if (offsetDays) shownDate.setDate(new Date().getDate() + offsetDays);
    if (task.typeData.name === 'single') {
      if (task.typeData.completedOnDates.length > 0) {
        task.typeData.completedOnDates = [];
      } else {
        task.typeData.completedOnDates.push(
          shownDate.toISOString().split('T')[0],
        );
      }
    } else {
      if (
        task.typeData.completedOnDates.includes(
          shownDate.toISOString().split('T')[0],
        )
      ) {
        task.typeData.completedOnDates = task.typeData.completedOnDates.filter(
          (date: string) => date !== shownDate.toISOString().split('T')[0],
        );
      } else {
        task.typeData.completedOnDates.push(
          shownDate.toISOString().split('T')[0],
        );
      }
    }

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
        {/* only allow toggle if task is due */}
        {taskDueBool && (
          <IonItemOption onClick={handleStatusToggle}>
            {taskOverdueBool === true ? 'Done' : 'To Do'}
          </IonItemOption>
        )}

        <IonItemOption onClick={handleEdit}>Edit</IonItemOption>
      </IonItemOptions>
      {/* task content */}
      <IonItem
        onClick={toggleShowDetailsOverride}
        className={taskOverdueBool !== true ? 'done' : ''}
      >
        <IonLabel>
          {/* TODO these two divs swap places when swiped*/}
          <div>
            {task?.name} {JSON.stringify(taskDueBool)}{' '}
            {JSON.stringify(taskOverdueBool)}
          </div>
          {task?.showDetailsOverride && (
            <div>
              {task?.createdDate} {task?.typeData.name} {task?.typeData.value}
            </div>
          )}
        </IonLabel>
      </IonItem>
    </IonItemSliding>
  );
};

export default TaskItem;
