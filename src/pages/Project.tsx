import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const Project: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Project Title</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Project UI goes here...</IonContent>
    </IonPage>
  );
};

export default Project;
