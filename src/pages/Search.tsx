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
import { groupTasks, sortTaskGroups, sortTasks, taskOverdue, localeToString } from '../dataManagement/utils';

const Search: React.FC = () => {
  const { tasks, projects, projectList, handleSetProjectList, getTask, locale } = useContext(Context);

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
            {localeToString(projectList?.searchSettings.showDone ? 'hide' : 'show', locale) as string}{' '}
            {localeToString('done', locale) as string}
          </IonButton>
          <IonButton
            onClick={() => {
              let newProjectList = { ...projectList } as ProjectListType;
              newProjectList.searchSettings.showDetails = !newProjectList.searchSettings.showDetails;
              handleSetProjectList(newProjectList);
              dismissListPopover();
            }}
          >
            {localeToString(projectList?.searchSettings.showDetails ? 'hide' : 'show', locale) as string}{' '}
            {localeToString('details', locale) as string}
          </IonButton>
          <IonButton
            onClick={() => {
              document.getElementById('open-sort-options-modal')?.click();
              dismissListPopover();
            }}
          >
            {localeToString('sort', locale) as string}
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
          <IonInput
            placeholder={localeToString('search', locale) as string}
            onIonInput={(e) => setSearchInput(e.target.value as string)}
          />
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
          {Object.keys(filteredTasks)
            .sort((a, b) => {
              if (a < b) return -1 * (projectList?.searchSettings.groupDesc ? -1 : 1);
              if (a > b) return 1 * (projectList?.searchSettings.groupDesc ? -1 : 1);
              return 0;
            })
            .map((key, groupIndex) => {
              const displayStrings = localeToString('taskTypeDisplayString', locale);
              return (
                <IonCard key={groupIndex}>
                  {key !== 'default' && (
                    <div className="group-label">
                      {projectList?.searchSettings.group === 'typeData'
                        ? (displayStrings[key as keyof typeof displayStrings] as string)
                        : key}
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
