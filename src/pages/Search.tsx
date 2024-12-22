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
import { ProjectListType, TaskType } from '../types';
import { groupTasks, sortTaskGroups, sortTasks, taskOverdue, typeDataToDisplayString } from '../dataManagement/utils';

const Search: React.FC = () => {
  const { tasks, projects, projectList, handleSetProjectList, getTask } = useContext(Context);

  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredTasks, setfilteredTasks] = useState<{ [key: string]: TaskType[] }>({});

  // filter tasks by keywords everytime search term changes
  useEffect(() => {
    if (!projectList?.searchSettings?.sort) return;

    let filteredTasks: TaskType[] = [];
    setfilteredTasks({});

    // search
    const searchArray = searchInput.split(' ').filter((term) => term !== ' ' && term !== '');
    tasks.forEach((task: TaskType) => {
      let match = false;
      searchArray.forEach((term) => {
        if (
          task.name.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
          task.notes.toLowerCase().indexOf(term.toLowerCase()) !== -1
        ) {
          match = true;
        }
      });
      if (match) filteredTasks.push(task);
    });

    // remove done if hidden
    filteredTasks = filteredTasks.filter(
      (task) =>
        projectList?.searchSettings.showDone ||
        (!projectList?.searchSettings.showDone && taskOverdue(getTask(task.id), new Date())),
    );

    // sort
    if (!projectList?.searchSettings.group || (projectList?.searchSettings.group as string) === '') {
      setfilteredTasks({
        default: sortTasks(filteredTasks, projectList?.searchSettings.sort, projectList?.searchSettings.sortDesc),
      });
    } else {
      setfilteredTasks(
        sortTaskGroups(
          groupTasks(filteredTasks, projectList?.searchSettings.group, projects),
          projectList?.searchSettings.sort,
          projectList?.searchSettings.sortDesc,
        ),
      );
    }
  }, [tasks, searchInput, projectList]);

  useEffect(() => {
    // set focus to input when displayed
    const searchBar = document.getElementById('search-bar');
    searchBar?.querySelector('ion-input')?.setFocus();
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
              dismissListPopover();
            }}
          >
            {projectList?.searchSettings.showDone ? 'Hide' : 'Show'} Done
          </IonButton>
          <IonButton
            onClick={() => {
              let newProjectList = { ...projectList } as ProjectListType;
              newProjectList.searchSettings.showDetails = !newProjectList.searchSettings.showDetails;
              handleSetProjectList(newProjectList);
              dismissListPopover();
            }}
          >
            {projectList?.searchSettings.showDetails ? 'Hide' : 'Show'} Details
          </IonButton>
          <IonButton
            onClick={() => {
              document.getElementById('open-sort-options-modal')?.click();
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
        <IonToolbar id="search-bar">
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
          {Object.keys(filteredTasks)?.length === 0 && <div>No tasks</div>}
          {filteredTasks.default?.length === 0 && <div>No tasks</div>}
          {Object.keys(filteredTasks)
            .sort((a, b) => {
              if (a < b) return -1 * (projectList?.searchSettings.groupDesc ? -1 : 1);
              if (a > b) return 1 * (projectList?.searchSettings.groupDesc ? -1 : 1);
              return 0;
            })
            .map((key, groupIndex) => {
              return (
                <IonCard key={groupIndex}>
                  {key !== 'default' && (
                    <div className="group-label">
                      {projectList?.searchSettings.group === 'typeData' ? typeDataToDisplayString(key) : key}
                    </div>
                  )}
                  {filteredTasks[key].map((task, taskIndex) => {
                    if (
                      projectList?.searchSettings.showDone ||
                      (!projectList?.searchSettings.showDone && taskOverdue(getTask(task.id), new Date()))
                    )
                      return (
                        <IonItem key={taskIndex}>
                          <TaskItem
                            taskId={task.id}
                            key={taskIndex}
                            showDetails={projectList?.searchSettings.showDetails}
                          />
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
