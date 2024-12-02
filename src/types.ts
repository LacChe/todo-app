export type TabType = 'list' | 'matrix' | 'calendar';
export type StatusType = 'todo' | 'done';

export type PreferenceKeyType = 'localProjectList' | 'localProjects' | 'localTasks' | 'currentTab' | 'currentProjectId';

export type ProjectListType = {
  id: string;
  projectIds: string[];
};

export type ProjectType = {
  id: string;
  name: string;
  color: string;
  taskIds: string[];
  viewSettings: {
    listSettings: ViewSettingsListType;
    matrixSettings: ViewSettingsMatrixType;
    calendarSettings: ViewSettingsCalendarType;
  };
};

export type ViewSettingsListType = {
  taskIds: string[];
  settings: ViewSettingsSettingsType;
};

export type ViewSettingsMatrixType = {
  blocks: [BlockType, BlockType, BlockType, BlockType];
  settings: ViewSettingsSettingsType;
};

export type BlockType = {
  name: string;
  taskIds: string[];
  color: string;
};

export type ViewSettingsCalendarType = {
  dateContainer: DateContainerType;
  settings: ViewSettingsSettingsType;
};

export type DateContainerType = {
  [key: string]: string[];
};

export type ViewSettingsSettingsType = {
  showDetails: boolean;
  showDone: boolean;
  sort?: string; // TODO change to sort types
  group?: string; // TODO change to group types
};

export type TaskType = {
  id: string;
  name: string;
  createdDate: string;
  status: StatusType;
  typeData: TaskTypeDataType;
  showDetailsOverride: boolean;
  notes: string;
};

export type TaskTypeDataType = {
  name: 'single' | 'everyNumDays' | 'everyDaysOfWeek' | 'everyDaysOfMonth' | 'onDates';
  value?: number | number[] | string[];
};
