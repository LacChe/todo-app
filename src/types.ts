export type TabType = 'list' | 'matrix' | 'calendar';

export type PreferenceKeyType =
  | 'localProjectList'
  | 'localProjects'
  | 'localTasks'
  | 'currentTab'
  | 'currentProjectId'
  | 'currentLocale';
export type TaskTypeDataTypeNameType = 'single' | 'everyNumDays' | 'everyDaysOfWeek' | 'everyDaysOfMonth' | 'onDates';
export type TaskTypeDataTypeValueType = undefined | number | number[] | string[];

export type SortParamsType = '' | 'name' | 'notes' | 'createdDate';
export type GroupParamsType = '' | 'createdDate' | 'projectName' | 'typeData';

export type ProjectListType = {
  id: string;
  projectIds: string[];
  searchSettings: ViewSettingsSettingsType;
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
  settings: ViewSettingsSettingsType;
};

export type ViewSettingsCalendarType = {
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

export type ViewSettingsSettingsType = {
  showDetails: boolean;
  showDone: boolean;
  sort?: SortParamsType;
  sortDesc?: boolean;
  group?: GroupParamsType;
  groupDesc?: boolean;
};

export type TaskType = {
  id: string;
  name: string;
  createdDate: string;
  typeData: TaskTypeDataType;
  showDetailsOverride: boolean;
  notes: string;
};

export type TaskTypeDataType = {
  name: TaskTypeDataTypeNameType;
  value?: TaskTypeDataTypeValueType;
  completedOnDates: string[];
};
