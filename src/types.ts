export type TabType = 'list' | 'matrix' | 'calendar';

export type PreferenceKeyType = 'currentTab' | 'currentProjectId';

export type ProjectListType = {
  id: string;
  projectIds: string[];
};

export type ProjectType = {
  id: string;
  name: string;
  color: string;
  taskIds: string[];
  viewSettings: {};
};
