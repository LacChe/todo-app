import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getPreference, getProjectList, getProjects, getTasks, getUserId, setPreference } from './dataRetrieval';
import { ProjectListType, ProjectType, TabType, TaskType } from '../types';

// TODO changing data should be done here, then updated to data retrieval and db
// TODO set types
type ContextType = {
  [key: string]: any;
};

export const Context = React.createContext<ContextType>({});

export const ContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  let [loading, setLoading] = useState<boolean>(true);

  // preferences
  let [currentTaskId, setCurrentTaskId] = useState<string>();
  let [currentProjectId, setCurrentProjectId] = useState<string>();
  let [currentTab, setCurrentTab] = useState<TabType>();

  // user data
  const [projectList, setProjectList] = useState<ProjectListType>();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  // load on first render
  useEffect(() => {
    handleLoading();
  }, []);

  // load preferences and user data then set loading to false
  async function handleLoading() {
    await loadPreferences();
    await loadUserData();
    setLoading(false);
  }

  /**
   * Load preferences from storage and set useStates.
   * Set defaults if no preference are found.
   */
  async function loadPreferences() {
    let retrievedCurrentTab = await getPreference('currentTab');
    setCurrentTab(retrievedCurrentTab as TabType);
    let retrievedCurrentProjectId = await getPreference('currentProjectId');
    setCurrentProjectId(retrievedCurrentProjectId as string);
  }

  /**
   * Load the user data from storage.
   */
  async function loadUserData() {
    // TODO error checking
    const retrievedProjectList = await getProjectList(getUserId());
    setProjectList(retrievedProjectList);
    const retrievedProjects = await getProjects(getUserId());
    setProjects(retrievedProjects);
    const retrievedtasks = await getTasks(getUserId());
    setTasks(retrievedtasks);
  }

  /**
   * Retrieve a project by its ID.
   *
   * @param {string} projectId - The ID of the project to retrieve.
   * @returns {ProjectType | undefined} The project object if found, otherwise undefined.
   */
  function getProject(projectId: string): ProjectType | undefined {
    const returnProject = projects.filter((project: ProjectType) => project.id === projectId)[0];
    return returnProject;
  }

  /**
   * Retrieve a task by its ID.
   *
   * @param {string} taskId - The ID of the task to retrieve.
   * @returns {TaskType | undefined} The task object if found, otherwise undefined.
   */
  function getTask(taskId: string): TaskType | undefined {
    const returnTask = tasks.filter((task: TaskType) => task.id === taskId)[0];
    return returnTask;
  }

  /**
   * Retrieve a task by its projects ID.
   *
   * @param {string} projectId - The ID of the project to retrieve tasks from.
   * @returns {TaskType | undefined} The task array.
   */
  function getTasksByProjectId(projectId: string): TaskType[] {
    let returnTasks: TaskType[] = [];
    const returnProject = projects.filter((project: ProjectType) => project.id === projectId)[0];
    if (returnProject) {
      returnTasks = tasks.filter((task) => returnProject.taskIds.includes(task.id));
    }
    return returnTasks;
  }

  /**
   * Retrieve a task by its ID.
   *
   * @param {string} taskId - The ID of the task to retrieve.
   * @returns {TaskType | undefined} The task object if found, otherwise undefined.
   */
  function getTaskById(taskId: string): TaskType | undefined {
    const returnTask = tasks.filter((task) => {
      if (task.id === taskId) return task;
    })[0];
    return returnTask;
  }

  /**
   * Set the current tab preference and save it to storage.
   * @param {TabType} tabName - The name of the tab to set as the current tab.
   */
  async function handleSetCurrentTab(tabName: TabType) {
    setCurrentTab(tabName);
    setPreference('currentTab', tabName);
  }

  /**
   * Set the current project ID preference and save it to storage.
   *
   * @param {string} projectId - The ID of the project to set as the current project.
   */
  async function handleSetCurrentProjectId(projectId: string) {
    setCurrentProjectId(projectId);
    setPreference('currentProjectId', projectId);
  }

  /**
   * Set the project list preference and save it to storage.
   * @param {ProjectListType} newProjectList - The new project list to set as the current project list.
   */
  async function handleSetProjectList(newProjectList: ProjectListType) {
    setProjectList(newProjectList);
    setPreference('localProjectList', JSON.stringify(newProjectList));
  }

  /**
   * Set the projects state and store it in preferences.
   *
   * @param {ProjectType[]} newProjects - The array of projects to set as the current projects.
   */
  async function handleSetProjects(newProjects: ProjectType[]) {
    setProjects(newProjects);
    setPreference('localProjects', JSON.stringify(newProjects));
  }

  /**
   * Set the tasks state and store it in preferences.
   *
   * @param {TaskType[]} newTasks - The array of tasks to set as the current tasks.
   */
  async function handleSetTasks(newTasks: TaskType[]) {
    setTasks(newTasks);
    setPreference('localTasks', JSON.stringify(newTasks));
  }

  return (
    <Context.Provider
      value={{
        loading,
        getProject,
        getTask,
        getTasksByProjectId,
        getTaskById,
        currentTab,
        handleSetCurrentTab,
        currentProjectId,
        setCurrentTaskId,
        currentTaskId,
        handleSetCurrentProjectId,
        projectList,
        handleSetProjectList,
        projects,
        handleSetProjects,
        tasks,
        handleSetTasks,
      }}
    >
      {children}
    </Context.Provider>
  );
};
