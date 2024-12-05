import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
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
  const [retrievedProject, setRetrievedProject] = useState<ProjectType>();
  const { loading, getProject, setProject, projects } = useContext(Context);

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
      setRetrievedProject(getProject(projectId));
    }
  }, [loading, projectId, projects]);

  function handleListReorder(e: CustomEvent<ItemReorderEventDetail>) {
    // save data to context
    const originalTaskIds = retrievedProject?.taskIds;
    if (originalTaskIds === undefined) return;

    let reorderedTaskIds = originalTaskIds?.filter((id: string, index: number) => index !== e.detail.from);
    reorderedTaskIds.splice(e.detail.to, 0, originalTaskIds[e.detail.from]);
    setProject({ ...retrievedProject, taskIds: reorderedTaskIds } as ProjectType);

    e.detail.complete(retrievedProject?.taskIds);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': retrievedProject?.color }}>
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* title */}
          <IonTitle>{retrievedProject?.name} ListView</IonTitle>
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
          {retrievedProject?.taskIds?.length === 0 && <div>No tasks</div>}
          <IonReorderGroup disabled={false} onIonItemReorder={handleListReorder}>
            {retrievedProject?.taskIds?.map((taskId, index) => {
              return (
                <IonItem key={index}>
                  <TaskItem taskId={taskId} key={index} />
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
              );
            })}
          </IonReorderGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListView;
