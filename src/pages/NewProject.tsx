import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { Dispatch, SetStateAction } from 'react';
import { add } from 'ionicons/icons';
import { ProjectListType, ProjectType } from '../types';

interface NewProjectPageProps {
  setProjectList: Dispatch<SetStateAction<ProjectListType | undefined>>;
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
}

const NewProject: React.FC<NewProjectPageProps> = ({ setProjectList, setProjects }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Add a Project</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => document.getElementById('open-modal')?.click()}>
          <IonIcon icon={add} />
          Add a new Project to Begin
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewProject;
