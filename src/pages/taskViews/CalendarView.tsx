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

const CalendarView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();
  const { loading, getProject, getTask, tasks } = useContext(Context);

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

  function findTasksForThisDate(retrievedProject: ProjectType) {
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - today.getDay() + dateColOffset + dateRowOffset * 7);

    let foundTaskIds: string[] = [];
    retrievedProject.taskIds.forEach((taskId: string) => {
      const task = getTask(taskId);
      if (!task) return;
      let matchDate = false;
      switch (task.typeData.name) {
        case 'single':
          matchDate = true;
          break;
        case 'everyNumDays':
          const startDate = new Date(task.createdDate);
          const dayDifference = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDifference % task.typeData.value === 0) matchDate = true;
          break;
        case 'everyDaysOfWeek':
          if (task.typeData.value.includes(checkDate.getDay())) matchDate = true;
          break;
        case 'everyDaysOfMonth':
          if (task.typeData.value.includes(checkDate.getDate())) matchDate = true;
          break;
        case 'onDates':
          if (task.typeData.value.includes(checkDate.toISOString().split('T')[0])) matchDate = true;
          break;
      }
      if (matchDate === true) foundTaskIds.push(taskId);
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
    for (let i = 0; i < 7; i++) {
      let date = new Date(today);
      date.setDate(date.getDate() + i - today.getDay() + dateRowOffset * 7);
      dates.push(date.toISOString().split('T')[0] + ' ' + date.getDay());
    }
    return (
      <div>
        <div>
          {/* year and month */}
          {today.getFullYear()} {monthsOfYearAbbr[today.getMonth()]}
        </div>
        <div className="calendar-view-date-slider">
          {/* last week TODO change to swipe gesture */}
          <button onClick={() => setDateRowOffset((prev) => prev - 1)}>{'<'}</button>
          {/* this weeks dates */}
          {dates.map((date, index) => (
            <button
              onClick={() => setDateColOffset(index)}
              className={dateColOffset === index ? 'selected' : ''}
              key={date}
            >
              <div>{dayOfWeekInitials[index]}</div>
              <div>{date.substring(8, 10).replace(/^0+/, '')}</div>
            </button>
          ))}
          {/* next week TODO change to swipe gesture */}
          <button onClick={() => setDateRowOffset((prev) => prev + 1)}>{'>'}</button>
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
