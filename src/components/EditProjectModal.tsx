import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
  useIonRouter,
  useIonPopover,
  IonList,
  IonReorderGroup,
  IonItem,
  IonReorder,
} from '@ionic/react';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ProjectListType, ProjectType } from '../types';
import { setPreference } from '../dataRetrieval';
import { checkmark, close, ellipse, square } from 'ionicons/icons';

interface EditProjectModalProps {
  setProjectList: Dispatch<SetStateAction<ProjectListType | undefined>>;
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ setProjects, setProjectList }) => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const router = useIonRouter();

  function handleCreateNewProject() {
    // TODO check valid data

    // TODO edited project
    // create new project
    const newProject: ProjectType = {
      id: 'temp',
      name: 'temp',
      color: '000000',
      taskIds: [],
      viewSettings: {},
    };

    // TODO save new project and project list
    // add new project to project list
    setProjects((prev: ProjectType[]) => {
      let newProjects = [...prev];
      newProjects.push(newProject);
      setPreference('localProjects', JSON.stringify(newProjects));
      return newProjects;
    });

    // TODO save new project and project list
    // add new id to project list
    setProjectList((prev: ProjectListType | undefined) => {
      let newProjectList;
      if (!prev) {
        newProjectList = {
          id: 'list-' + uuidv4(),
          projectIds: [],
        };
      } else {
        newProjectList = { ...prev };
      }
      // this set state is running twice, check duplicate before push
      if (!newProjectList.projectIds.includes(newProject.id)) newProjectList.projectIds.push(newProject.id);
      setPreference('localProjectList', JSON.stringify(newProjectList));
      return newProjectList;
    });

    router.push(`/app/project/${newProject.id}/list`, 'root', 'replace');
  }

  function colorPickerPopover() {
    const colors = [
      ['#000000', '#FFFFFF', '#FF0000', '#00FF00'],
      ['#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      ['#FFA500', '#800080', '#0000FF', '#FFFF00'],
      ['#FF00FF', '#00FFFF', '#FFA500', '#800080'],
    ];
    return (
      <IonContent class="ion-padding color-picker-popover">
        {colors.map((row, index) => {
          return (
            <div key={index}>
              {row.map((color, index) => {
                return (
                  <button className="color-picker-popover-button" style={{ backgroundColor: color }} key={index} />
                );
              })}
            </div>
          );
        })}
      </IonContent>
    );
  }
  const [presentPopover] = useIonPopover(colorPickerPopover);

  function handleBlockReorder(e: any) {
    console.log('reorder', e);
    e.detail.complete();
  }

  return (
    <IonModal
      ref={editProjectModal}
      className="edit-project-modal"
      trigger="open-edit-project-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form className="edit-project-modal-form">
        <IonToolbar>
          <IonButton
            type="button"
            slot="start"
            onClick={() => {
              console.log('delete');
              // editProjectModal.current?.dismiss();
            }}
          >
            <IonIcon icon={close} />
          </IonButton>
          <IonButton
            type="submit"
            slot="end"
            onClick={() => {
              console.log('save');
              // editProjectModal.current?.dismiss();
            }}
          >
            <IonIcon icon={checkmark} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          <IonInput
            label="Name"
            placeholder="Project Name"
            // value={newProjectName}
            // onIonInput={(e) => setNewProjectName(e.detail.value as string)}
          />
          <div className="form-inputs-color-picker">
            <IonLabel>Color</IonLabel>
            <IonButton onClick={(e: any) => presentPopover({ event: e })}>
              <IonIcon icon={square} />
            </IonButton>
          </div>
          <IonLabel>Blocks</IonLabel>
          <IonList className="form-inputs-block-list">
            <IonReorderGroup disabled={false} onIonItemReorder={handleBlockReorder}>
              {[1, 2, 3, 4].map((block, index) => {
                return (
                  <IonItem key={index}>
                    <IonLabel>Item {block}</IonLabel>
                    <IonReorder slot="end"></IonReorder>
                  </IonItem>
                );
              })}
            </IonReorderGroup>
          </IonList>
        </div>
      </form>
    </IonModal>
  );
};

export default EditProjectModal;
