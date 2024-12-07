import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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

const CalendarView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();
  const { loading, getProject } = useContext(Context);

  const [dateRowOffset, setDateRowOffset] = useState<number>(0);
  const [dateColOffset, setDateColOffset] = useState<number>(0);

  const dayOfWeekInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthsOfYearAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // retrieve project when id changes
  useEffect(() => {
    if (!loading) {
      if (projectId === 'undefined') return;
      const retrievedProject = getProject(projectId);
      if (retrievedProject) setProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);
      setDateColOffset(new Date().getDay());
    }
  }, [loading, projectId]);

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
    const today = new Date();
    let dates = [];
    for (let i = 0; i < 7; i++) {
      var date = new Date(today);
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
            <button className={dateColOffset === index ? 'selected' : ''} key={date}>
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
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default CalendarView;
