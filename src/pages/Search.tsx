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
  IonTitle,
  IonToolbar,
  useIonPopover,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './taskViews/TaskView.css';
import { Context } from '../dataManagement/ContextProvider';
import TaskItem from '../components/TaskItem';
import { taskOverdue } from '../dataManagement/utils';
import { ProjectType } from '../types';

const Search: React.FC = () => {
  const { projects, tasks, getTask } = useContext(Context);

  // TODO temp list
  const [taskIds, setTaskIds] = useState<string[]>([]);

  useEffect(() => {
    let combinedTasks: string[] = [];
    projects.forEach((project: ProjectType) => {
      combinedTasks.push(...project.taskIds);
    });
    setTaskIds(combinedTasks);
  }, [projects]);

  /**
   * Popover for options specific to the list view
   * @returns {JSX.Element}
   */
  function listOptionsPopover(): JSX.Element {
    return (
      <IonContent class="ion-padding">
        <IonButtons>
          <IonButton
            onClick={() => {
              // TODO update settings
              dismissListPopover();
            }}
          >
            Done
          </IonButton>
          <IonButton
            onClick={() => {
              // TODO update settings
              dismissListPopover();
            }}
          >
            Details
          </IonButton>
          <IonButton>Sort</IonButton>
        </IonButtons>
      </IonContent>
    );
  }
  const [presentListPopover, dismissListPopover] = useIonPopover(listOptionsPopover);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* title */}
          <IonTitle>Search</IonTitle>
          {/* options button */}
          <IonButtons slot="end" collapse={true}>
            <IonButton onClick={(e: any) => presentListPopover({ event: e })}>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* list task items */}
        <IonList>
          {taskIds?.length === 0 && <div>No tasks</div>}
          {taskIds?.map((taskId, index) => {
            /*
            if (
              retrievedProject?.viewSettings.listSettings.settings.showDone ||
              (!retrievedProject?.viewSettings.listSettings.settings.showDone &&
                taskOverdue(getTask(taskId), new Date()))
            )
             */
            return (
              <IonItem key={index}>
                <TaskItem
                  taskId={taskId}
                  key={index}
                  // showDetails={retrievedProject?.viewSettings.listSettings.settings.showDetails}
                />
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Search;
