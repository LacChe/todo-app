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
  viewSettings: {}; // TODO
};

export type TaskType = {
  id: string;
  name: string;
  createdDate: string;
  status: StatusType;
  typeData: any; // TODO
  notes: string;
};
