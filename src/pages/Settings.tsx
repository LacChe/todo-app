import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect } from 'react';
import { Context } from '../dataManagement/ContextProvider';

const Settings: React.FC = () => {
  const { handleSetCurrentProjectId } = useContext(Context);

  // clear current project id
  useEffect(() => {
    handleSetCurrentProjectId('settings');
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Settings UI goes here...</IonContent>
    </IonPage>
  );
};

export default Settings;
