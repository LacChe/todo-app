import { Preferences } from '@capacitor/preferences';
import { PreferenceKeyType, ProjectListType, ProjectType, TaskType } from '../types';
import { mockProjectList, mockProjects, mockTasks } from '../mockData/index';

/**
 * Retrieve the ID of the user.
 *
 * @returns {string}
 * A promise that resolves to the ID of the user.
 */
export function getUserId(): string {
  // console.log('load real data');
  return 'user-0000';
}

/**
 * Retrieve the project list for a given user.
 *
 * @param {string} userId
 * The ID of the user whose project list to retrieve.
 *
 * @returns {Promise<ProjectListType>}
 * A promise that resolves to the project list object.
 */
export async function getProjectList(userId: string): Promise<ProjectListType> {
  let retrievedLocalProjectList = await getPreference('localProjectList');
  let projectList;
  if (retrievedLocalProjectList) projectList = await JSON.parse(retrievedLocalProjectList);
  return projectList;
}

/**
 * Retrieve all projects for a given user.
 *
 * @param {string} userId
 * The ID of the user whose projects to retrieve.
 *
 * @returns {Promise<ProjectType[]>}
 * A promise that resolves to an array of project objects.
 */
export async function getProjects(userId: string): Promise<ProjectType[]> {
  let retrievedLocalProjects = await getPreference('localProjects');
  let projects = [];
  if (retrievedLocalProjects) projects = await JSON.parse(retrievedLocalProjects);
  return projects;
}

/**
 * Retrieve all tasks for a given user.
 *
 * @param {string} userId
 * The ID of the user whose tasks to retrieve.
 *
 * @returns {Promise<TaskType[]>}
 * A promise that resolves to an array of task objects.
 */
export async function getTasks(userId: string): Promise<TaskType[]> {
  let retrievedLocalTasks = await getPreference('localTasks');
  let tasks = [];
  if (retrievedLocalTasks) tasks = await JSON.parse(retrievedLocalTasks);
  return tasks;
}

/**
 * Set a preference value in the data store.
 *
 * @param {PreferenceKeyType} key
 * The key of the preference to set.
 *
 * @param {string} value
 * The value to which to set the preference.
 *
 * @returns {Promise<void>}
 * Resolves when the preference has been set.
 */
export const setPreference = async (key: PreferenceKeyType, value: string): Promise<void> => {
  await Preferences.set({
    key,
    value,
  });
};

/**
 * Retrieve a preference value from the data store.
 *
 * @param {PreferenceKeyType} key
 * The key of the preference to retrieve.
 *
 * @returns {Promise<string | null>}
 * A promise that resolves to the value of the preference, or null if not found.
 */
export const getPreference = async (key: PreferenceKeyType): Promise<string | null> => {
  // get mock data
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    switch (key) {
      case 'localProjectList':
        return JSON.stringify(mockProjectList[0]);
      case 'localProjects':
        return JSON.stringify(mockProjects);
      case 'localTasks':
        return JSON.stringify(mockTasks);
    }
    const { value } = await Preferences.get({ key });
    return value;
  } else {
    const { value } = await Preferences.get({ key });
    return value;
  }
};

/**
 * Remove a preference from the data store.
 *
 * @param {PreferenceKeyType} key
 * The key of the preference to remove.
 *
 * @returns {Promise<void>}
 * Resolves when the preference has been removed.
 */
export const removePreference = async (key: PreferenceKeyType): Promise<void> => {
  await Preferences.remove({ key });
};
