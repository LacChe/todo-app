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
import { Context } from '../dataManagement/ContextProvider';
import { localeToString } from '../dataManagement/utils';
import { languageOutline } from 'ionicons/icons';

import './taskViews/TaskView.css';

const Settings: React.FC = () => {
  const { locale, handleSetLocale } = useContext(Context);

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
      <IonContent className="ion-padding">
        <div className="locale-selection-wrapper">
          <IonIcon icon={languageOutline} />
          <IonButton fill={locale === 'en' ? 'solid' : 'outline'} onClick={() => handleSetLocale('en')}>
            English
          </IonButton>
          <IonButton fill={locale === 'cn' ? 'solid' : 'outline'} onClick={() => handleSetLocale('cn')}>
            中文
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
