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
  const { loading, getProject, tasks, handleSetProjects, projects } = useContext(Context);

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
      } else {
        // console.error(`ProjectId: ${projectId} not found`);
      }
    }
  }, [loading, projectId, tasks]);

  function handleListReorder(e: any) {
    const originalTaskIds = project?.taskIds;
    if (originalTaskIds === undefined) return;

    let reorderedTaskIds = originalTaskIds?.filter((id: string, index: number) => index !== e.detail.from);
    reorderedTaskIds.splice(e.detail.to, 0, originalTaskIds[e.detail.from]);

    // save reordered project taskId list
    let newProjects = projects.map((project: ProjectType) => {
      if (project.id === projectId) {
        let retrievedProject = { ...project, taskIds: reorderedTaskIds };
        return retrievedProject;
      } else return project;
    });
    handleSetProjects(newProjects);
    e.detail.complete();
  }

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
          {project?.taskIds?.length === 0 && <div>No tasks</div>}
          <IonReorderGroup disabled={false} onIonItemReorder={handleListReorder}>
            {project?.taskIds?.map((taskId, index) => {
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
