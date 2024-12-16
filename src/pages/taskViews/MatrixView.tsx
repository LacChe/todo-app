import {
  GestureDetail,
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
  createGesture,
  IonItem,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BlockType, ProjectType } from '../../types';
import { ellipsisVerticalOutline } from 'ionicons/icons';

import './TaskView.css';
import { Context } from '../../dataManagement/ContextProvider';
import TaskItem from '../../components/TaskItem';
import { taskOverdue } from '../../dataManagement/utils';

const MatrixView: React.FC = () => {
  let { projectId } = useParams() as { projectId: string };
  const { loading, getProject, setProject, tasks, getTask } = useContext(Context);

  const [retrievedProject, setRetrievedProject] = useState<ProjectType>();

  // TODO cant drag on first load

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
      const retrievedProject = getProject(projectId) as ProjectType;

      // add loose tasks to last block
      const looseTasks = findLooseTasks(retrievedProject);
      retrievedProject?.viewSettings?.matrixSettings.blocks[3].taskIds.push(...looseTasks);

      if (retrievedProject) setRetrievedProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);
    }
  }, [loading, projectId, tasks]);

  // add drag gestures to all task items
  // TODO check why gestures arent working on first load of webpage
  useEffect(() => {
    // find blocks sizes on every resize
    let blockBoundingBoxes: [
      { x: number; y: number; w: number; h: number },
      { x: number; y: number; w: number; h: number },
      { x: number; y: number; w: number; h: number },
      { x: number; y: number; w: number; h: number },
    ] = [
      { x: 0, y: 0, w: 0, h: 0 },
      { x: 0, y: 0, w: 0, h: 0 },
      { x: 0, y: 0, w: 0, h: 0 },
      { x: 0, y: 0, w: 0, h: 0 },
    ];
    window.addEventListener('resize', handleResize);
    handleResize();

    // find blocks bounding boxes
    function handleResize() {
      [0, 1, 2, 3].forEach((index) => {
        const blockBox = document.getElementsByClassName(`matrix-block-${index}`)[0]?.getBoundingClientRect();
        blockBoundingBoxes[index] = {
          x: blockBox?.left,
          y: blockBox?.top,
          w: blockBox?.width,
          h: blockBox?.height,
        };
      });
    }

    // add gestures to task items
    const matrixGridElem = document.getElementsByClassName('matrix-grid')[0];
    const taskItems = Array.from(document.getElementsByClassName('task-item')) as HTMLElement[];
    if (!taskItems) return;
    taskItems.forEach((taskItemElem) => {
      const style = taskItemElem.style;
      const clonedTaskItemElem = taskItemElem.cloneNode(true) as HTMLElement;
      const cloneStyle = clonedTaskItemElem.style;

      // only make child label draggable
      if (!taskItemElem.children[1].children[1]) return;
      const gesture = createGesture({
        el: taskItemElem.children[1].children[1],
        threshold: 0,
        onStart: () => onStart(),
        onMove: (detail: GestureDetail) => onMove(detail),
        onEnd: (detail: GestureDetail) => onEnd(detail),
        gestureName: 'draggable',
      });
      gesture.enable();

      const onStart = () => {
        // add clone to grid
        let sideMenuWidth = document.getElementById('side-menu')?.getBoundingClientRect().width;
        if (!sideMenuWidth) sideMenuWidth = 0;
        matrixGridElem.appendChild(clonedTaskItemElem);
        cloneStyle.position = 'fixed';
        cloneStyle.width = taskItemElem.getBoundingClientRect().width + 'px';
        cloneStyle.left = taskItemElem.getBoundingClientRect().left - sideMenuWidth + 'px';
        cloneStyle.top = taskItemElem.getBoundingClientRect().top + 'px';
        cloneStyle.transform = 'translate(0px, 0px)';
        cloneStyle.zIndex = '9999';
        // set original to low opacity
        style.opacity = '0.5';
      };
      const onMove = (detail: GestureDetail) => {
        cloneStyle.transform = `translate(${detail.deltaX}px, ${detail.deltaY}px)`;
      };
      const onEnd = (detail: GestureDetail) => {
        // remove clone
        matrixGridElem.removeChild(clonedTaskItemElem);
        // return original to full opacity
        style.opacity = '1';
        // find dest block
        let destBoxIndex = 3;
        blockBoundingBoxes.forEach((box, index) => {
          if (
            detail.currentX >= box.x &&
            detail.currentX <= box.x + box.w &&
            detail.currentY >= box.y &&
            detail.currentY <= box.y + box.h
          ) {
            destBoxIndex = index;
          }
        });
        // move task to dest block
        const taskToMove = taskItemElem.id;
        setRetrievedProject((prev) => {
          let newProject = { ...prev } as ProjectType;
          newProject.viewSettings.matrixSettings.blocks = newProject.viewSettings.matrixSettings.blocks.map(
            (block, index) => {
              let newBlock = { ...block };
              if (index === destBoxIndex) {
                // only move task if not original block
                if (!newBlock.taskIds.includes(taskToMove)) {
                  newBlock.taskIds.push(taskToMove);
                }
              } else {
                if (newBlock.taskIds.includes(taskToMove)) {
                  newBlock.taskIds = newBlock.taskIds.filter((id) => id !== taskToMove);
                }
              }
              return newBlock;
            },
          ) as [BlockType, BlockType, BlockType, BlockType];
          // recalc sizes when blocks change size due to moving tasks
          handleResize();
          return newProject;
        });
      };
    });

    // clean listener
    return () => window.removeEventListener('resize', handleResize);
  });

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
                <IonCol size="1" key={blockIndex} className={`matrix-block-${blockIndex}`}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardSubtitle style={{ fontSize: '0.65rem', color: block?.color }}>
                        {block.name}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    {block.taskIds.map((taskId) => {
                      if (
                        retrievedProject?.viewSettings.matrixSettings.settings.showDone ||
                        (!retrievedProject?.viewSettings.matrixSettings.settings.showDone &&
                          taskOverdue(getTask(taskId), new Date()))
                      )
                        return (
                          <IonItem key={taskId}>
                            <TaskItem
                              taskId={taskId}
                              showDetails={retrievedProject?.viewSettings.matrixSettings.settings.showDetails}
                              matrixView={true}
                            />
                          </IonItem>
                        );
                    })}
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
