import { IonButton, IonIcon, IonLabel, IonModal } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { GroupParamsType, ProjectListType, SortParamsType, ViewSettingsSettingsType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

const SortOptionsModal: React.FC = () => {
  const { currentProjectId, projectList, handleSetProjectList, getProject, setProject } = useContext(Context);

  const sorts = ['name', 'notes', 'createdDate'];
  const groups = ['createdDate', 'projectName', 'typeData'];
  const [sortSettings, setSortSettings] = useState<ViewSettingsSettingsType | undefined>();

  useEffect(() => {
    if (!projectList) return;
    if (currentProjectId === 'settings') return;
    if (currentProjectId === 'search') setSortSettings(projectList.searchSettings);
    else {
      const retrievedProject = getProject(currentProjectId);
      if (!retrievedProject) return;
      setSortSettings(retrievedProject.viewSettings.listSettings.settings);
    }
  });

  if (!sortSettings) return;

  function handleSetSortSettings(newSettings: ViewSettingsSettingsType) {
    if (currentProjectId === 'search') {
      let newProjectList = { ...projectList } as ProjectListType;
      newProjectList.searchSettings = newSettings;
      handleSetProjectList(newProjectList);
    } else {
      const retrievedProject = getProject(currentProjectId);
      if (!retrievedProject) return;
      let newProject = { ...retrievedProject };
      newProject.viewSettings.listSettings.settings = newSettings;
      setProject(newProject);
    }
    setSortSettings(newSettings);
  }

  return (
    <IonModal trigger="open-sort-options-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="open-sort-options-modal">
        <IonLabel>Sort By</IonLabel>
        <div>
          {sorts.map((sort) => (
            <IonButton
              fill={sortSettings.sort === sort ? 'solid' : 'outline'}
              key={sort}
              onClick={() => {
                let newSortSettings = { ...sortSettings } as ViewSettingsSettingsType;
                if (newSortSettings.sort !== sort) newSortSettings.sort = sort as SortParamsType;
                else newSortSettings.sortDesc = !newSortSettings.sortDesc;
                handleSetSortSettings(newSortSettings);
              }}
            >
              {sort}
              {sortSettings.sort === sort ? (
                sortSettings.sortDesc ? (
                  <IonIcon icon={chevronDownOutline} />
                ) : (
                  <IonIcon icon={chevronUpOutline} />
                )
              ) : (
                ''
              )}
            </IonButton>
          ))}
        </div>
        <IonLabel>Group By</IonLabel>
        <div>
          {groups.map((group) => {
            if (group === 'projectName' && currentProjectId !== 'search') return;
            return (
              <IonButton
                fill={sortSettings.group === group ? 'solid' : 'outline'}
                key={group}
                onClick={() => {
                  let newSortSettings = { ...sortSettings } as ViewSettingsSettingsType;
                  if (newSortSettings.group !== group) {
                    newSortSettings.group = group as GroupParamsType;
                    newSortSettings.groupDesc = false;
                  } else if (newSortSettings.group === group && newSortSettings.groupDesc === false) {
                    newSortSettings.groupDesc = true;
                  } else {
                    newSortSettings.group = '';
                  }
                  handleSetSortSettings(newSortSettings);
                }}
              >
                {group}
                {sortSettings.group === group ? (
                  sortSettings.groupDesc ? (
                    <IonIcon icon={chevronDownOutline} />
                  ) : (
                    <IonIcon icon={chevronUpOutline} />
                  )
                ) : (
                  ''
                )}
              </IonButton>
            );
          })}
        </div>
      </div>
    </IonModal>
  );
};

export default SortOptionsModal;
