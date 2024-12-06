import {
  IonAlert,
  IonButton,
  IonDatetime,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToolbar,
} from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Context } from '../../dataManagement/ContextProvider';
import { checkmark, close } from 'ionicons/icons';
import { StatusType, TaskType, TaskTypeDataTypeNameType, TaskTypeDataTypeValueType } from '../../types';

const EditTaskModal: React.FC = () => {
  const editProjectModal = useRef<HTMLIonModalElement>(null);
  const { getTask, setTask, tasks, deleteTask, currentTaskId } = useContext(Context);

  let retrievedTask: TaskType = getTask(currentTaskId);
  const [newTaskName, setNewTaskName] = useState<string>(retrievedTask?.name);
  const [newTaskStatus, setNewTaskStatus] = useState<StatusType>(retrievedTask?.status);
  const [newTaskNotes, setNewTaskNotes] = useState<string>(retrievedTask?.notes);
  const [newTaskTypeDataName, setNewTaskTypeDataName] = useState<TaskTypeDataTypeNameType>(
    retrievedTask?.typeData.name,
  );
  const [everyNumDaysValue, setEveryNumDaysValue] = useState<number | null>();
  const [everyDaysOfWeekValue, setEveryDaysOfWeekValue] = useState<string[] | null>();
  const [everyDaysOfMonthValue, setEveryDaysOfMonthValue] = useState<number[] | null>();
  const [onDatesValue, setOnDatesValue] = useState<string[] | null>();

  useEffect(() => {
    loadData();
  }, [currentTaskId, tasks]);

  /**
   * Retrieves the task with the given ID and updates the state
   * with the task's name, status, notes, and typeData.
   * Called when the modal is opened and when the task ID changes.
   */
  async function loadData() {
    retrievedTask = getTask(currentTaskId);
    setNewTaskName(retrievedTask?.name);
    setNewTaskStatus(retrievedTask?.status);
    setNewTaskNotes(retrievedTask?.notes);
    setNewTaskTypeDataName(retrievedTask?.typeData.name);
    setEveryNumDaysValue(null);
    setEveryDaysOfWeekValue(null);
    setEveryDaysOfMonthValue(null);
    setOnDatesValue(null);
    switch (retrievedTask?.typeData.name) {
      case 'everyNumDays':
        setEveryNumDaysValue(retrievedTask?.typeData.value as number);
        break;
      case 'everyDaysOfWeek':
        setEveryDaysOfWeekValue(retrievedTask?.typeData.value as string[]);
        break;
      case 'everyDaysOfMonth':
        setEveryDaysOfMonthValue(retrievedTask?.typeData.value as number[]);
        break;
      case 'onDates':
        setOnDatesValue(retrievedTask?.typeData.value as string[]);
        break;
    }
  }

  /**
   * Edits the task with the given ID with the given name, status, notes, and typeData.
   * If the new task name is empty, does nothing.
   * After editing, dismisses the modal.
   */
  function handleEditTask() {
    // TODO check values
    if (!newTaskName || newTaskName === '') return;

    retrievedTask.name = newTaskName;
    retrievedTask.status = newTaskStatus;
    retrievedTask.notes = newTaskNotes;
    switch (newTaskTypeDataName) {
      case 'everyNumDays':
        retrievedTask.typeData = { name: newTaskTypeDataName, value: everyNumDaysValue as TaskTypeDataTypeValueType };
        break;
      case 'everyDaysOfWeek':
        retrievedTask.typeData = {
          name: newTaskTypeDataName,
          value: everyDaysOfWeekValue as TaskTypeDataTypeValueType,
        };
        break;
      case 'everyDaysOfMonth':
        retrievedTask.typeData = {
          name: newTaskTypeDataName,
          value: everyDaysOfMonthValue as TaskTypeDataTypeValueType,
        };
        break;
      case 'onDates':
        retrievedTask.typeData = { name: newTaskTypeDataName, value: onDatesValue as TaskTypeDataTypeValueType };
        break;
    }

    setTask(retrievedTask);
    setEveryNumDaysValue(null);
    setEveryDaysOfWeekValue(null);
    setEveryDaysOfMonthValue(null);
    setOnDatesValue(null);

    editProjectModal.current?.dismiss();
  }

  /**
   * Deletes the task with the given ID and then dismisses the modal.
   */
  function handleDeleteTask() {
    deleteTask(currentTaskId);
    editProjectModal.current?.dismiss();
  }

  /**
   * Handles the submission of the edit task form by calling handleEditTask()
   * and then dismissing the modal.
   *
   * @param {any} e - The form submission event.
   */
  function handleSubmit(e: any) {
    e.preventDefault();
    handleEditTask();
    editProjectModal.current?.dismiss();
  }

  return (
    <IonModal
      ref={editProjectModal}
      className="edit-task-modal"
      trigger="open-edit-task-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
    >
      <form onSubmit={handleSubmit} className="edit-task-modal-form">
        <IonToolbar>
          <IonButton type="button" slot="start" id="present-delete-confirmation">
            <IonIcon icon={close} />
          </IonButton>
          <IonButton type="submit" slot="end">
            <IonIcon icon={checkmark} />
          </IonButton>
        </IonToolbar>
        <div className="form-inputs">
          {/* Name Input */}
          <IonInput
            label="Name"
            placeholder="Task Name"
            value={newTaskName}
            onIonInput={(e) => setNewTaskName(e.detail.value as string)}
          />
          {/* Status Input */}
          <IonSegment value={newTaskStatus} onIonChange={(e) => setNewTaskStatus(e.detail.value as StatusType)}>
            <IonSegmentButton value="todo">
              <IonLabel>Todo</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="done">
              <IonLabel>Done</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {/* Notes Input */}
          <IonTextarea
            label="Notes"
            placeholder="Task Notes"
            value={newTaskNotes}
            onIonInput={(e) => setNewTaskNotes(e.detail.value as string)}
          />
          {/* TypeData Name Input */}
          <IonSelect
            value={newTaskTypeDataName}
            onIonChange={(e) => setNewTaskTypeDataName(e.detail.value)}
            interface="popover"
          >
            <IonSelectOption value="single">Singular</IonSelectOption>
            <IonSelectOption value="everyNumDays">Every # Days</IonSelectOption>
            <IonSelectOption value="everyDaysOfWeek">On Days of Week</IonSelectOption>
            <IonSelectOption value="everyDaysOfMonth">On Days of Month</IonSelectOption>
            <IonSelectOption value="onDates">On Dates</IonSelectOption>
          </IonSelect>
          {/* TypeData Value Input everyNumDays */}
          {newTaskTypeDataName === 'everyNumDays' && (
            <div>
              Every
              <IonInput
                type="number"
                placeholder="#"
                value={everyNumDaysValue}
                onIonChange={(e) => setEveryNumDaysValue(e.detail.value ? Number.parseInt(e.detail.value) : 0)}
              />
              Days
            </div>
          )}
          {/* TypeData Value Input everyDaysOfWeek */}
          {newTaskTypeDataName === 'everyDaysOfWeek' && (
            <IonSelect
              value={everyDaysOfWeekValue}
              onIonChange={(e) => setEveryDaysOfWeekValue(e.detail.value)}
              interface="popover"
              multiple={true}
              placeholder="Choose days of the week"
            >
              <IonSelectOption value="sun">Sunday</IonSelectOption>
              <IonSelectOption value="mon">Monday</IonSelectOption>
              <IonSelectOption value="tue">Tuesday</IonSelectOption>
              <IonSelectOption value="wed">Wednesday</IonSelectOption>
              <IonSelectOption value="thu">Thursday</IonSelectOption>
              <IonSelectOption value="fri">Friday</IonSelectOption>
              <IonSelectOption value="sat">Saturday</IonSelectOption>
            </IonSelect>
          )}
          {/* TypeData Value Input everyDaysOfMonth */}
          {/* TODO change to custom grid selection component */}
          {newTaskTypeDataName === 'everyDaysOfMonth' && (
            <IonSelect
              value={everyDaysOfMonthValue}
              onIonChange={(e) => setEveryDaysOfMonthValue(e.detail.value)}
              interface="popover"
              multiple={true}
              placeholder="Choose days of the month"
            >
              <IonSelectOption value={1}>1</IonSelectOption>
              <IonSelectOption value={2}>2</IonSelectOption>
              <IonSelectOption value={3}>3</IonSelectOption>
              <IonSelectOption value={4}>4</IonSelectOption>
              <IonSelectOption value={5}>5</IonSelectOption>
              <IonSelectOption value={6}>6</IonSelectOption>
              <IonSelectOption value={7}>7</IonSelectOption>
              <IonSelectOption value={8}>8</IonSelectOption>
              <IonSelectOption value={9}>9</IonSelectOption>
              <IonSelectOption value={10}>10</IonSelectOption>
              <IonSelectOption value={11}>11</IonSelectOption>
              <IonSelectOption value={12}>12</IonSelectOption>
              <IonSelectOption value={13}>13</IonSelectOption>
              <IonSelectOption value={14}>14</IonSelectOption>
              <IonSelectOption value={15}>15</IonSelectOption>
              <IonSelectOption value={16}>16</IonSelectOption>
              <IonSelectOption value={17}>17</IonSelectOption>
              <IonSelectOption value={18}>18</IonSelectOption>
              <IonSelectOption value={19}>19</IonSelectOption>
              <IonSelectOption value={20}>20</IonSelectOption>
              <IonSelectOption value={21}>21</IonSelectOption>
              <IonSelectOption value={22}>22</IonSelectOption>
              <IonSelectOption value={23}>23</IonSelectOption>
              <IonSelectOption value={24}>24</IonSelectOption>
              <IonSelectOption value={25}>25</IonSelectOption>
              <IonSelectOption value={26}>26</IonSelectOption>
              <IonSelectOption value={27}>27</IonSelectOption>
              <IonSelectOption value={28}>28</IonSelectOption>
              <IonSelectOption value={29}>29</IonSelectOption>
              <IonSelectOption value={30}>30</IonSelectOption>
              <IonSelectOption value={31}>31</IonSelectOption>
            </IonSelect>
          )}
          {/* TypeData Value Input everyDaysOfWeek */}
          {newTaskTypeDataName === 'onDates' && (
            <IonDatetime
              onIonChange={(e) => setOnDatesValue(e.detail.value as string[])}
              presentation="date"
              multiple={true}
              value={onDatesValue}
            />
          )}
          {/* Confirmation Alert for Deleting */}
          <IonAlert
            header={`Delete task ${newTaskName}?`}
            trigger="present-delete-confirmation"
            buttons={[
              {
                text: 'Cancel',
              },
              {
                text: 'Delete',
                role: 'confirm',
                handler: handleDeleteTask,
              },
            ]}
          ></IonAlert>
        </div>
      </form>
    </IonModal>
  );
};

export default EditTaskModal;
