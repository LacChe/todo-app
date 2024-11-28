import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectType } from '../types';
import { getProject } from '../dataRetrieval';

const tab2: React.FC = () => {
  let { projectId } = useParams() as any;

  const [project, setProject] = useState<ProjectType>();
  useEffect(() => {
    // TODO error checking
    const retrievedProject = getProject(projectId);
    setProject(retrievedProject);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default tab2;
