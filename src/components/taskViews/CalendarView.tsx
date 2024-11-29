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
import { ProjectType } from '../../types';
import { getProject } from '../../dataRetrieval';

const CalendarView: React.FC = () => {
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
          <IonTitle>{project?.name} CalendarView</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default CalendarView;
