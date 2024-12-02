import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
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
import TaskItem from '../../components/TaskItem';

const ListView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectType>();
  const { loading, getProject, tasks } = useContext(Context);

  function listOptionsPopover() {
    return (
      <IonContent class="ion-padding">
        <IonButtons>
          <IonButton
            onClick={() => {
              document.getElementById('open-edit-project-modal')?.click();
              dismissListPopover();
            }}
          >
            Edit
          </IonButton>
          <IonButton>Hide Done</IonButton>
          <IonButton>Hide Details</IonButton>
          <IonButton>Sort</IonButton>
        </IonButtons>
      </IonContent>
    );
  }
  const [presentListPopover, dismissListPopover] = useIonPopover(listOptionsPopover);

  // retrieve project when id changes
  useEffect(() => {
    if (!loading) {
      if (projectId === 'undefined') return;
      const retrievedProject = getProject(projectId);
      if (retrievedProject) {
        setProject(retrievedProject);
      } else console.error(`ProjectId: ${projectId} not found`);
    }
  }, [loading, projectId, tasks]);

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
            <IonButton onClick={(e: any) => presentListPopover({ event: e })}>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* list task items */}
        <IonList>
          {project?.taskIds?.map((taskId, index) => (
            <TaskItem taskId={taskId} key={index} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListView;
