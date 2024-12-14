import {
  IonButton,
  IonButtons,
  IonCard,
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
import { GroupParamsType, SortParamsType, TaskType } from '../types';
import { groupTasks, sortTaskGroups, sortTasks } from '../dataManagement/utils';

const Search: React.FC = () => {
  const { tasks, projects, handleSetCurrentProjectId, currentProjectId } = useContext(Context);

  // TODO move settings to storage

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTasks, setfilteredTasks] = useState<{ [key: string]: TaskType[] }>({});
  const [sortParam, setSortParam] = useState<SortParamsType>('name');
  const [sortDesc, setSortDesc] = useState<boolean>();
  const [groupParam, setGroupParam] = useState<GroupParamsType>('projectName');
  const [groupDesc, setGroupDesc] = useState<boolean>();

  const [showDone, setShowDone] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // filter tasks by keywords everytime search term changes
  useEffect(() => {
    let filteredTasks: TaskType[] = [];

    const searchArray = searchInput.split(' ').filter((term) => term !== ' ' && term !== '');
    tasks.forEach((task: TaskType) => {
      let match = false;
      searchArray.forEach((term) => {
        if (task.name.indexOf(term) !== -1 || task.notes.indexOf(term) !== -1) {
          match = true;
        }
      });
      if (match) filteredTasks.push(task);
    });

    if (!groupParam || (groupParam as string) === '') {
      setfilteredTasks({ default: sortTasks(filteredTasks, sortParam, sortDesc) });
    } else {
      setfilteredTasks(sortTaskGroups(groupTasks(filteredTasks, groupParam, projects), sortParam, sortDesc));
    }
  }, [tasks, searchInput]);

  // clear current project id
  useEffect(() => {
    handleSetCurrentProjectId();
  });

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
              setShowDone(!showDone);
              dismissListPopover();
            }}
          >
            {showDone ? 'Hide' : 'Show'} Done
          </IonButton>
          <IonButton
            onClick={() => {
              setShowDetails(!showDetails);
              dismissListPopover();
            }}
          >
            {showDetails ? 'Hide' : 'Show'} Details
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
        <div>{currentProjectId}</div>
        {/* list task items */}
        <IonList>
          {Object.keys(filteredTasks)?.length === 0 && <div>No tasks</div>}
          {Object.keys(filteredTasks)
            .sort((a, b) => {
              if (a < b) return -1 * (groupDesc ? -1 : 1);
              if (a > b) return 1 * (groupDesc ? -1 : 1);
              return 0;
            })
            .map((key, groupIndex) => {
              return (
                <IonCard key={groupIndex}>
                  {key !== 'default' && <div>{key}</div>}
                  {filteredTasks[key].map((task, taskIndex) => {
                    return (
                      <IonItem key={taskIndex}>
                        <TaskItem taskId={task.id} key={taskIndex} showDetails={showDetails} />
                      </IonItem>
                    );
                  })}
                </IonCard>
              );
            })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Search;
