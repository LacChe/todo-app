import { IonButton, IonIcon, IonLabel, IonModal } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { GroupParamsType, ProjectListType, SortParamsType, ViewSettingsSettingsType } from '../../types';
import { Context } from '../../dataManagement/ContextProvider';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { localeToString } from '../../dataManagement/utils';

const SortOptionsModal: React.FC = () => {
  const { currentProjectId, projectList, handleSetProjectList, getProject, setProject, locale } = useContext(Context);

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
      <div className="sort-options-modal">
        <IonLabel>{localeToString('sortBy', locale) as string}</IonLabel>
        <div>
          {Object.keys(localeToString('sortsList', locale)).map((sortKey) => {
            const displayString = (localeToString('sortsList', locale) as { [key: string]: string })[sortKey] as string;
            return (
              <IonButton
                fill={sortSettings.sort === sortKey ? 'solid' : 'outline'}
                key={sortKey}
                onClick={() => {
                  let newSortSettings = { ...sortSettings } as ViewSettingsSettingsType;
                  if (newSortSettings.sort !== sortKey) newSortSettings.sort = sortKey as SortParamsType;
                  else newSortSettings.sortDesc = !newSortSettings.sortDesc;
                  handleSetSortSettings(newSortSettings);
                }}
              >
                {displayString}
                {sortSettings.sort === sortKey ? (
                  sortSettings.sortDesc ? (
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
        <IonLabel>{localeToString('groupBy', locale) as string}</IonLabel>
        <div>
          {Object.keys(localeToString('groupsList', locale)).map((groupKey) => {
            if (groupKey === 'projectName' && currentProjectId !== 'search') return;
            const displayString = (localeToString('groupsList', locale) as { [key: string]: string })[
              groupKey
            ] as string;
            return (
              <IonButton
                fill={sortSettings.group === groupKey ? 'solid' : 'outline'}
                key={groupKey}
                onClick={() => {
                  let newSortSettings = { ...sortSettings } as ViewSettingsSettingsType;
                  if (newSortSettings.group !== groupKey) {
                    newSortSettings.group = groupKey as GroupParamsType;
                    newSortSettings.groupDesc = false;
                  } else if (newSortSettings.group === groupKey && newSortSettings.groupDesc === false) {
                    newSortSettings.groupDesc = true;
                  } else {
                    newSortSettings.group = '';
                  }
                  handleSetSortSettings(newSortSettings);
                }}
              >
                {displayString}
                {sortSettings.group === groupKey ? (
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
