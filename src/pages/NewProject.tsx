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
import React from 'react';
import { addOutline } from 'ionicons/icons';

const NewProject: React.FC = () => {
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
        <IonButton onClick={() => document.getElementById('open-add-project-modal')?.click()}>
          <IonIcon icon={addOutline} />
          Add a new Project to Begin
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewProject;
