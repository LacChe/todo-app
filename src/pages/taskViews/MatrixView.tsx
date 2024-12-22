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

      if (retrievedProject) setRetrievedProject(retrievedProject);
      else console.error(`ProjectId: ${projectId} not found`);
    }
  }, [loading, projectId, tasks]);

  // add drag gestures to all task items
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

      // only make child label and notes draggable
      if (!taskItemElem.children[1].children[1]) return;
      const gestureLabel = createGesture({
        el: taskItemElem.children[1].children[1],
        threshold: 0,
        onStart: () => onStart(),
        onMove: (detail: GestureDetail) => onMove(detail),
        onEnd: (detail: GestureDetail) => onEnd(detail),
        gestureName: 'draggable',
      });
      gestureLabel.enable();
      const gestureNotes = createGesture({
        el: taskItemElem.children[1].children[2],
        threshold: 0,
        onStart: () => onStart(),
        onMove: (detail: GestureDetail) => onMove(detail),
        onEnd: (detail: GestureDetail) => onEnd(detail),
        gestureName: 'draggable',
      });
      gestureNotes.enable();

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
