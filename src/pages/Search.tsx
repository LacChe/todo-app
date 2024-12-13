import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonToolbar,
  useIonPopover,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './taskViews/TaskView.css';
import { Context } from '../dataManagement/ContextProvider';
import TaskItem from '../components/TaskItem';
import { TaskType } from '../types';

const Search: React.FC = () => {
  const { tasks } = useContext(Context);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTasks, setfilteredTasks] = useState<TaskType[]>([]);

  // TODO sort by date by default
  // filter tasks by keywords everytime search term changes
  useEffect(() => {
    let combinedTasks: TaskType[] = [];

    const searchArray = searchInput.split(' ').filter((term) => term !== ' ' && term !== '');
    console.log(searchArray);
    tasks.forEach((task: TaskType) => {
      let match = false;
      searchArray.forEach((term) => {
        if (task.name.indexOf(term) !== -1 || task.notes.indexOf(term) !== -1) {
          match = true;
        }
      });
      if (match) combinedTasks.push(task);
    });
    setfilteredTasks(combinedTasks);
  }, [tasks, searchInput]);

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
          {/* search bar */}
          <IonInput placeholder="Search" onIonInput={(e) => setSearchInput(e.target.value as string)} />
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
          {filteredTasks?.length === 0 && <div>No tasks</div>}
          {filteredTasks?.map((task, index) => {
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
                  taskId={task.id}
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
