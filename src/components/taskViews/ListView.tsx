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
  useIonPopover,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectType } from '../../types';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './TaskView.css';
import { Context } from '../../dataManagement/ContextProvider';

const ListView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();
  const { loading, getProject } = useContext(Context);

  function listOptionsPopover() {
    return (
      <IonContent class="ion-padding">
        <IonButtons>
          <IonButton onClick={() => document.getElementById('open-edit-project-modal')?.click()}>Edit</IonButton>
          <IonButton>Hide Completed</IonButton>
          <IonButton>Hide Details</IonButton>
          <IonButton>Sort</IonButton>
        </IonButtons>
      </IonContent>
    );
  }
  const [presentPopover] = useIonPopover(listOptionsPopover);

  // retrieve project when id changes
  // retrieve project when id changes
  useEffect(() => {
    if (!loading) {
      if (projectId === 'undefined') return;
      const retrievedProject = getProject(projectId);
      if (retrievedProject) setProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);
    }
  }, [loading, projectId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': project?.color }}>
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* title */}
          <IonTitle>{project?.name} ListView</IonTitle>
          {/* options button */}
          <IonButtons slot="end" collapse={true}>
            <IonButton onClick={(e: any) => presentPopover({ event: e })}>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default ListView;
