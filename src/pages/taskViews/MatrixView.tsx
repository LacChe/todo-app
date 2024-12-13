import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRow,
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

const MatrixView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const { loading, getProject, setProject, tasks, getTask } = useContext(Context);

  const [retrievedProject, setRetrievedProject] = useState<ProjectType>();
  const [looseTasks, setFindLooseTasks] = useState<string[]>();

  /**
   * Find tasks that are not part of any block in the current project's matrix view.
   * This is done by combining the task IDs of all blocks and then filtering out
   * the task IDs that are not in the combined list from the project's task IDs.
   *
   * @param {ProjectType} project - The project in which to find loose tasks.
   * @returns {string[]} An array of task IDs that are not part of any block.
   */
  function findLooseTasks(project: ProjectType): string[] {
    if (!project) return [];
    let combinedBlocksTaskIds: string[] = [];
    let block0 = project?.viewSettings.matrixSettings.blocks[0].taskIds;
    let block1 = project?.viewSettings.matrixSettings.blocks[1].taskIds;
    let block2 = project?.viewSettings.matrixSettings.blocks[2].taskIds;
    let block3 = project?.viewSettings.matrixSettings.blocks[3].taskIds;
    if (block0) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block0);
    if (block1) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block1);
    if (block2) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block2);
    if (block3) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block3);
    return project?.taskIds.filter((id: string) => !combinedBlocksTaskIds.includes(id));
  }

  /**
   * Popover for options specific to the matrix view
   * @returns {JSX.Element}
   */
  function matrixOptionsPopover(): JSX.Element {
    return (
      <IonContent class="ion-padding">
        <IonButtons>
          <IonButton
            onClick={() => {
              document.getElementById('open-edit-project-modal')?.click();
              dismissMatrixPopover();
            }}
          >
            Edit
          </IonButton>
          <IonButton
            onClick={() => {
              let newProject = { ...retrievedProject } as ProjectType;
              newProject.viewSettings.matrixSettings.settings.showDone =
                !newProject.viewSettings.matrixSettings.settings.showDone;
              setRetrievedProject(newProject);
              setProject(newProject);
              dismissMatrixPopover();
            }}
          >
            {!retrievedProject?.viewSettings.matrixSettings.settings.showDone ? 'Show ' : 'Hide '} Done
          </IonButton>
          <IonButton
            onClick={() => {
              let newProject = { ...retrievedProject } as ProjectType;
              newProject.viewSettings.matrixSettings.settings.showDetails =
                !newProject.viewSettings.matrixSettings.settings.showDetails;
              setRetrievedProject(newProject);
              setProject(newProject);
              dismissMatrixPopover();
            }}
          >
            {!retrievedProject?.viewSettings.matrixSettings.settings.showDetails ? 'Show ' : 'Hide '} Details
          </IonButton>
        </IonButtons>
      </IonContent>
    );
  }
  const [presentMatrixPopover, dismissMatrixPopover] = useIonPopover(matrixOptionsPopover);

  // retrieve project when data changes
  useEffect(() => {
    if (!loading) {
      if (projectId === 'undefined') return;
      const retrievedProject = getProject(projectId);
      if (retrievedProject) setRetrievedProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);

      setFindLooseTasks(findLooseTasks(retrievedProject));
    }
  }, [loading, projectId, tasks]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': retrievedProject?.color }}>
          {/* menu button */}
          <IonButtons slot="start" collapse={true}>
            <IonMenuButton />
          </IonButtons>
          {/* title */}
          <IonTitle>{retrievedProject?.name} MatrixView</IonTitle>
          {/* options button */}
          <IonButtons slot="end" collapse={true}>
            <IonButton onClick={(e: any) => presentMatrixPopover({ event: e })}>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="matrix-view-content">
        <IonGrid className="matrix-grid">
          <IonRow>
            {retrievedProject?.viewSettings.matrixSettings.blocks.map((block, blockIndex) => {
              return (
                <IonCol size="1" key={blockIndex}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardSubtitle style={{ fontSize: '0.65rem', color: block?.color }}>
                        {block.name}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    {block.taskIds.map((taskId) => (
                      <TaskItem
                        taskId={taskId}
                        key={taskId}
                        showDetails={retrievedProject?.viewSettings.matrixSettings.settings.showDetails}
                      />
                    ))}
                    {blockIndex === 3 &&
                      looseTasks &&
                      looseTasks.length > 0 &&
                      looseTasks.map((looseTaskId) => (
                        <TaskItem
                          taskId={looseTaskId}
                          key={looseTaskId}
                          showDetails={retrievedProject?.viewSettings.matrixSettings.settings.showDetails}
                        />
                      ))}
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MatrixView;
