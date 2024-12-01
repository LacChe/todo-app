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
  IonPopover,
  useIonPopover,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectType } from '../../types';
import { getProject } from '../../dataRetrieval';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './TaskView.css';

const MatrixView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();

  const Popover = () => (
    <IonContent class="ion-padding">
      <IonButtons>
        <IonButton>Edit</IonButton>
        <IonButton>Hide Completed</IonButton>
        <IonButton>Hide Details</IonButton>
      </IonButtons>
    </IonContent>
  );
  const [presentPopover] = useIonPopover(Popover);

  // retrieve project when id changes
  useEffect(() => {
    loadData();
  }, [projectId]);

  async function loadData() {
    if (projectId === 'undefined') return;
    const retrievedProject = await getProject(projectId);
    if (retrievedProject) setProject(retrievedProject);
    else console.error(`ProjectId: ${projectId} not found`);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* title */}
          <IonTitle>{project?.name} MatrixView</IonTitle>
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

export default MatrixView;
