import React, { PropsWithChildren, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getPreference, getProjectList, getProjects, getTasks, getUserId, setPreference } from './dataRetrieval';
import { GroupParamsType, ProjectListType, ProjectType, SortParamsType, TabType, TaskType } from '../types';

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

  const colorGrid = [
    ['#FF5733', '#FF7F0E', '#FFD700', '#32CD32'],
    ['#2CA02C', '#1F77B4', '#00BFFF', '#8A2BE2'],
    ['#9467BD', '#8B0000', '#D2691E', '#FF6347'],
    ['#C71585', '#4B0082', '#0000FF', '#7F7F7F'],
  ];

  const dayOfWeekInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthsOfYearAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
   * Load the current tab and project ID preferences from storage and set them
   * to the state.
   *
   * @returns {Promise<void>}
   */
  async function loadPreferences(): Promise<void> {
    let retrievedCurrentTab = await getPreference('currentTab');
    if (!retrievedCurrentTab) retrievedCurrentTab = 'list';
    setCurrentTab(retrievedCurrentTab as TabType);
    let retrievedCurrentProjectId = await getPreference('currentProjectId');
    setCurrentProjectId(retrievedCurrentProjectId as string);
  }

  /**
   * Load user data including project list, projects, and tasks from storage and set them to the state.
   *
   * This function retrieves the user data by making asynchronous calls to fetch the project list,
   * projects, and tasks for the current user identified by the user ID. The retrieved data is then
   * set to the corresponding state variables.
   *
   * @returns {Promise<void>}
   * This function returns a promise that resolves when the user data has been successfully loaded
   * and set to the state.
   */
  async function loadUserData(): Promise<void> {
    const retrievedProjectList = await getProjectList(getUserId());
    setProjectList(retrievedProjectList);
    const retrievedProjects = await getProjects(getUserId());
    setProjects(retrievedProjects);
    const retrievedtasks = await getTasks(getUserId());
    setTasks(retrievedtasks);
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
   * Sets a project to the state and saves it to storage.
   *
   * The project is added if doesn't exist or replaces the project with the same id
   * A project list is created if none exists
   *
   * @param {ProjectType} newProject - The new project to set.
   */
  async function setProject(newProject: ProjectType) {
    // create project list if not exists
    let newProjectList;
    if (!projectList) {
      newProjectList = {
        id: 'list-' + uuidv4(),
        projectIds: [] as string[],
        searchSettings: {
          showDetails: false,
          showDone: true,
          sort: 'name' as SortParamsType,
          group: '' as GroupParamsType,
        },
      };
    } else {
      newProjectList = { ...projectList };
    }
    // add project id to project list if not exists
    if (!newProjectList.projectIds.includes(newProject.id)) {
      newProjectList.projectIds.push(newProject.id);
      handleSetProjectList(newProjectList);
    }

    // add project to projects
    let newProjects = projects.filter((project: ProjectType) => project.id !== newProject.id);
    newProjects.push(newProject);
    handleSetProjects(newProjects);
  }

  /**
   * Deletes a project and updates the project list.
   *
   * Removes the project from the project list, removes all tasks in the project,
   * and removes the project from the list of projects.
   *
   * @param {string} deletedProjectId
   * The ID of the project to delete.
   *
   * @returns {Promise<string>}
   * A promise that resolves to 'deleted' if the project was deleted successfully,
   * otherwise 'Error: no project list'.
   */
  async function deleteProject(deletedProjectId: string): Promise<string> {
    // remove from project list
    if (!projectList) {
      console.error('Error: no project list');
      return 'Error: no project list';
    }
    let newProjectList = { ...projectList };
    newProjectList.projectIds = newProjectList.projectIds.filter((id: string) => id !== deletedProjectId);
    await handleSetProjectList(newProjectList);

    // delete tasks
    let retrievedProject = projects.filter((project: ProjectType) => project.id === deletedProjectId)[0];
    let newTasks = tasks.filter((task: TaskType) => !retrievedProject.taskIds.includes(task.id));
    await handleSetTasks(newTasks);

    // delete project
    let newProjects = projects.filter((project: ProjectType) => project.id !== deletedProjectId);
    await handleSetProjects(newProjects);

    return 'deleted';
  }

  /**
   * Set a task and add it to the current project's task list and the master task list.
   *
   * This function adds the task to the task list of the current project and to the
   * master task list if it is not already there.
   *
   * @param {TaskType} newTask - The task to add.
   */
  async function setTask(newTask: TaskType) {
    if (currentProjectId && currentProjectId !== 'search' && currentProjectId !== 'settings') {
      let newProject = { ...getProject(currentProjectId) } as ProjectType;
      // add task id to projects task list if doesnt exist
      if (!newProject.taskIds?.includes(newTask.id)) {
        newProject.taskIds?.push(newTask.id);
        setProject(newProject);
      }
      // add task to matrix view last block if doesnt exist
      let combinedBlocksTaskIds: string[] = [];
      let block0 = newProject?.viewSettings.matrixSettings.blocks[0].taskIds;
      let block1 = newProject?.viewSettings.matrixSettings.blocks[1].taskIds;
      let block2 = newProject?.viewSettings.matrixSettings.blocks[2].taskIds;
      let block3 = newProject?.viewSettings.matrixSettings.blocks[3].taskIds;
      if (block0) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block0);
      if (block1) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block1);
      if (block2) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block2);
      if (block3) combinedBlocksTaskIds = combinedBlocksTaskIds.concat(block3);
      if (!combinedBlocksTaskIds.includes(newTask.id)) {
        newProject?.viewSettings.matrixSettings.blocks[3].taskIds.push(newTask.id);
      }
    }

    // add task to tasks
    let newTasks = tasks.filter((task: TaskType) => task.id !== newTask.id);
    newTasks.push(newTask);
    handleSetTasks(newTasks);
  }

  /**
   * Deletes a task and removes it from its parent project.
   *
   * This function removes the task from the parent project's task list,
   * and removes the task from the list of tasks.
   *
   * @param {string} deletedTaskId
   * The ID of the task to delete.
   *
   * @returns {Promise<string>}
   * A promise that resolves to 'deleted' if the task was deleted successfully,
   * otherwise an error message.
   */
  async function deleteTask(deletedTaskId: string): Promise<string> {
    // remove from parent project
    if (!tasks) {
      console.error('Error: no task list');
      return 'Error: no task list';
    }
    let newProject = projects.filter((project: ProjectType) => project.taskIds.includes(deletedTaskId))[0];
    if (!newProject) {
      console.error('Error: no parent project found');
      return 'Error: no parent project found';
    }

    // remove from project master list
    newProject.taskIds = newProject.taskIds.filter((id: string) => id !== deletedTaskId);

    // remove from project matrix view settings
    newProject.viewSettings.matrixSettings.blocks.forEach((block, index) => {
      block.taskIds = block.taskIds.filter((id) => id !== deletedTaskId);
      newProject.viewSettings.matrixSettings.blocks[index] = block;
    });
    await setProject(newProject);

    // remove from task list
    let newTasks = tasks.filter((task: TaskType) => task.id !== deletedTaskId);
    await handleSetTasks(newTasks);

    return 'deleted';
  }

  return (
    <Context.Provider
      value={{
        loading,
        colorGrid,
        dayOfWeekInitials,
        monthsOfYearAbbr,
        //
        currentTab,
        handleSetCurrentTab,
        currentProjectId,
        handleSetCurrentProjectId,
        currentTaskId,
        setCurrentTaskId,
        //
        projectList,
        handleSetProjectList,
        //
        projects,
        getProject,
        setProject,
        deleteProject,
        //
        tasks,
        getTask,
        setTask,
        deleteTask,
        //
      }}
    >
      {children}
    </Context.Provider>
  );
};
