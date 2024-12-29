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
import React, { useContext } from 'react';
import { addOutline } from 'ionicons/icons';
import { Context } from '../dataManagement/ContextProvider';
import { localeToString } from '../dataManagement/utils';

const NewProject: React.FC = () => {
  const { locale } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{localeToString('addAProject', locale) as string}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => document.getElementById('open-add-project-modal')?.click()}>
          <IonIcon icon={addOutline} />
          {localeToString('addANewProjectToBegin', locale) as string}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewProject;
