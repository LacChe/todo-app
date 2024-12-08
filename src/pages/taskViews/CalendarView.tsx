import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonToolbar,
  useIonPopover,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectType } from '../../types';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './TaskView.css';
import { Context } from '../../dataManagement/ContextProvider';
import TaskItem from '../../components/TaskItem';
import { taskDue } from '../../dataManagement/utils';

const CalendarView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const { loading, getProject, getTask, tasks } = useContext(Context);

  const [project, setProject] = useState<ProjectType>();

  const [dateRowOffset, setDateRowOffset] = useState<number>(0);
  const [dateColOffset, setDateColOffset] = useState<number>(new Date().getDay());
  const [taskIdsForDate, setTaskIdsForDate] = useState<string[]>([]);

  const today = new Date();
  const dayOfWeekInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthsOfYearAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // retrieve project when id changes
  useEffect(() => {
    if (!loading) {
      // init project
      if (projectId === 'undefined') return;
      const retrievedProject = getProject(projectId);
      if (retrievedProject) setProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);

      // init taskIdsForDate
      findTasksForThisDate(retrievedProject);
    }
  }, [loading, projectId, tasks, dateRowOffset, dateColOffset]);

  /**
   * Finds and sets task IDs that are due on a specific date for a given project.
   *
   * This function calculates the date based on the current day of the week and
   * the specified row and column offsets. It then iterates over the task IDs
   * in the provided project, checks if each task is due on the calculated date
   * using the taskDue utility function, and updates the state with the IDs of
   * the tasks that are due.
   *
   * @param {ProjectType} retrievedProject - The project to find tasks for.
   */
  function findTasksForThisDate(retrievedProject: ProjectType) {
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - today.getDay() + dateColOffset + dateRowOffset * 7);

    let foundTaskIds: string[] = [];
    retrievedProject.taskIds.forEach((taskId: string) => {
      const task = getTask(taskId);
      if (!task) return;
      if (new Date(task.createdDate) > new Date(checkDate)) return;

      if (taskDue(task, checkDate)) foundTaskIds.push(taskId);
    });
    setTaskIdsForDate(foundTaskIds);
  }

  /**
   * Popover for options specific to the calendar view
   * @returns {JSX.Element}
   */
  function calendarOptionsPopover(): JSX.Element {
    return (
      <IonContent class="ion-padding">
        <IonButtons>
          <IonButton
            onClick={() => {
              document.getElementById('open-edit-project-modal')?.click();
              dismissCalendarPopover();
            }}
          >
            Edit
          </IonButton>
          <IonButton>Hide Done</IonButton>
          <IonButton>Hide Details</IonButton>
          {/* add ootion for hiding singular tasks */}
        </IonButtons>
      </IonContent>
    );
  }
  const [presentCalendarPopover, dismissCalendarPopover] = useIonPopover(calendarOptionsPopover);

  /**
   * A date slider that displays this week and allows you to navigate to the past or future week
   * @returns {JSX.Element}
   */
  function dateSlider(): JSX.Element {
    let dates = [];
    let date = new Date(today);
    for (let i = 0; i < 7; i++) {
      date = new Date(today);
      date.setDate(date.getDate() + i - today.getDay() + dateRowOffset * 7);
      dates.push(date.toISOString().split('T')[0] + ' ' + date.getDay());
    }
    date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + dateColOffset + dateRowOffset * 7);
    return (
      <div>
        <div>
          {/* year and month */}
          {date.getFullYear()} {monthsOfYearAbbr[date.getMonth()]}
        </div>
        <div className="calendar-view-date-slider">
          {/* last week TODO change to swipe gesture */}
          <button
            onClick={() => {
              setTaskIdsForDate([]);
              setDateRowOffset((prev) => prev - 1);
            }}
          >
            {'<'}
          </button>
          {/* this weeks dates */}
          {dates.map((date, index) => (
            <button
              onClick={() => {
                setTaskIdsForDate([]);
                setDateColOffset(index);
              }}
              className={dateColOffset === index ? 'selected' : ''}
              key={date}
            >
              <div>{dayOfWeekInitials[index]}</div>
              <div>{date.substring(8, 10).replace(/^0+/, '')}</div>
            </button>
          ))}
          {/* next week TODO change to swipe gesture */}
          <button
            onClick={() => {
              setTaskIdsForDate([]);
              setDateRowOffset((prev) => prev + 1);
            }}
          >
            {'>'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': project?.color }}>
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* calendar slider */}
          <div>{dateSlider()}</div>
          {/* options button */}
          <IonButtons slot="end" collapse={true}>
            <IonButton onClick={(e: any) => presentCalendarPopover({ event: e })}>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {taskIdsForDate?.length === 0 && <div>No tasks</div>}
          {taskIdsForDate.map((taskId: string, index: number) => (
            <IonItem key={index}>
              <TaskItem offsetDays={dateRowOffset * 7 - today.getDay() + dateColOffset} taskId={taskId} key={index} />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CalendarView;
