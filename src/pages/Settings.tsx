import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';
import { Context } from '../dataManagement/ContextProvider';
import { localeToString } from '../dataManagement/utils';

const Settings: React.FC = () => {
  const { locale } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{localeToString('settings', locale) as string}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Settings UI goes here...</IonContent>
    </IonPage>
  );
};

export default Settings;
