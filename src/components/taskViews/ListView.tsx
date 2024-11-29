import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectType } from '../../types';
import { getProject } from '../../dataRetrieval';

const ListView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();

  // retrieve project when id changes
  useEffect(() => {
    if (projectId === 'undefined') return;
    const retrievedProject = getProject(projectId);
    if (retrievedProject) setProject(retrievedProject);
    else console.error(`ProjectId: ${projectId} not found`);
  }, [projectId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{project?.name} ListView</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default ListView;
