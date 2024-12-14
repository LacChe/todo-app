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
  IonModal,
  IonPage,
  IonToolbar,
  useIonPopover,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './taskViews/TaskView.css';
import { Context } from '../dataManagement/ContextProvider';
import TaskItem from '../components/TaskItem';
import { ProjectListType, TaskType, ViewSettingsSettingsType } from '../types';
import { groupTasks, sortTaskGroups, sortTasks, taskOverdue } from '../dataManagement/utils';
import SortOptionsModal from '../components/modals/SortOptionsModal';

const Search: React.FC = () => {
  const { tasks, projects, handleSetCurrentProjectId, currentProjectId, projectList, handleSetProjectList, getTask } =
    useContext(Context);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTasks, setfilteredTasks] = useState<{ [key: string]: TaskType[] }>({});
  const [searchSettings, setSearchSettings] = useState<ViewSettingsSettingsType>(projectList?.searchSettings);

  // filter tasks by keywords everytime search term changes
  useEffect(() => {
    if (!searchSettings?.sort) return;

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

    if (!searchSettings.group || (searchSettings.group as string) === '') {
      setfilteredTasks({ default: sortTasks(filteredTasks, searchSettings.sort, searchSettings.sortDesc) });
    } else {
      setfilteredTasks(
        sortTaskGroups(
          groupTasks(filteredTasks, searchSettings.group, projects),
          searchSettings.sort,
          searchSettings.sortDesc,
        ),
      );
    }
  }, [tasks, searchInput, searchSettings]);

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
              let newProjectList = { ...projectList } as ProjectListType;
              newProjectList.searchSettings.showDone = !newProjectList.searchSettings.showDone;
              handleSetProjectList(newProjectList);
              setSearchSettings(newProjectList.searchSettings);
              dismissListPopover();
            }}
          >
            {searchSettings.showDone ? 'Hide' : 'Show'} Done
          </IonButton>
          <IonButton
            onClick={() => {
              let newProjectList = { ...projectList } as ProjectListType;
              newProjectList.searchSettings.showDetails = !newProjectList.searchSettings.showDetails;
              handleSetProjectList(newProjectList);
              setSearchSettings(newProjectList.searchSettings);
              dismissListPopover();
            }}
          >
            {searchSettings.showDetails ? 'Hide' : 'Show'} Details
          </IonButton>
          <IonButton
            onClick={() => {
              document.getElementById('open-search-sort-modal')?.click();
              dismissListPopover();
            }}
          >
            Sort
          </IonButton>
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
              if (a < b) return -1 * (searchSettings.groupDesc ? -1 : 1);
              if (a > b) return 1 * (searchSettings.groupDesc ? -1 : 1);
              return 0;
            })
            .map((key, groupIndex) => {
              return (
                <IonCard key={groupIndex}>
                  {key !== 'default' && <div>{key}</div>}
                  {filteredTasks[key].map((task, taskIndex) => {
                    if (
                      searchSettings.showDone ||
                      (!searchSettings.showDone && taskOverdue(getTask(task.id), new Date()))
                    )
                      return (
                        <IonItem key={taskIndex}>
                          <TaskItem taskId={task.id} key={taskIndex} showDetails={searchSettings.showDetails} />
                        </IonItem>
                      );
                  })}
                </IonCard>
              );
            })}
        </IonList>
        {/* sorting modal*/}
        <div id="open-search-sort-modal" />
        <SortOptionsModal triggerId="open-search-sort-modal" />
      </IonContent>
    </IonPage>
  );
};

export default Search;
