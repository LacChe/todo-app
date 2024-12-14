import { IonButton, IonModal } from '@ionic/react';
import React from 'react';
import { GroupParamsType, SortParamsType, ViewSettingsSettingsType } from '../../types';

type SortOptionsModalProps = {
  triggerId: string;
  sortSettings: ViewSettingsSettingsType;
  handleSetSortSettings: (newSettings: ViewSettingsSettingsType) => void;
};

const SortOptionsModal: React.FC<SortOptionsModalProps> = ({ triggerId, handleSetSortSettings, sortSettings }) => {
  if (!sortSettings) return;

  const sorts = ['name', 'notes', 'createdDate'];
  const groups = ['createdDate', 'projectName', 'typeData'];
  return (
    <IonModal trigger={triggerId} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div>
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
              {sort} {sortSettings.sort === sort ? (sortSettings.sortDesc ? 'D' : 'A') : ''}
            </IonButton>
          ))}
        </div>
        <div>
          {groups.map((group) => (
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
              {group} {sortSettings.group === group ? (sortSettings.groupDesc ? 'D' : 'A') : ''}
            </IonButton>
          ))}
        </div>
      </div>
    </IonModal>
  );
};

export default SortOptionsModal;
