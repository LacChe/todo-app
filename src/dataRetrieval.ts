import mockProjectLists from './mockData/projectLists.json';
import mockProjects from './mockData/projects.json';

import { Preferences } from '@capacitor/preferences';
import { PreferenceKeyType, ProjectListType, ProjectType } from './types';

/**
 * Retrieve the ID of the user.
 *
 * @returns {string}
 * A promise that resolves to the ID of the user.
 */
export function getUserId(): string {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    return 'user-0000';
  } else {
    // TODO load real data
    console.log('TODO load real data');
    return 'user-0000';
  }
}

/**
 * Retrieve the project list for a given user.
 *
 * @param {string} userId
 * The ID of the user whose project list to retrieve.
 *
 * @returns {ProjectListType}
 * A promise that resolves to a project list object.
 */
export function getProjectList(userId: string): ProjectListType {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    return mockProjectLists[0];
  } else {
    // TODO load real data
    console.log('TODO load real data');
    return mockProjectLists[0];
  }
}

/**
 * Retrieve all projects for a given user.
 *
 * @param {string} userId
 * The ID of the user whose projects to retrieve.
 *
 * @returns {ProjectType[]}
 * A promise that resolves to an array of project objects.
 */
export function getProjects(userId: string): ProjectType[] {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    const returnProjects = mockProjects.filter((project) => mockProjectLists[0].projectIds.includes(project.id));
    return returnProjects;
  } else {
    // TODO load real data
    console.log('TODO load real data');
    const returnProjects = mockProjects.filter((project) => mockProjectLists[0].projectIds.includes(project.id));
    return returnProjects;
  }
}

/**
 * Retrieve a project by its ID.
 *
 * @param {string} projectId
 * The ID of the project to retrieve.
 *
 * @returns {ProjectType | null}
 * A promise that resolves to the requested project, or null if not found.
 */
export function getProject(projectId: string): ProjectType | null {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    const returnProject = mockProjects.filter((project) => project.id === projectId)[0];
    return returnProject;
  } else {
    // TODO load real data
    console.log('TODO load real data');
    const returnProject = mockProjects.filter((project) => project.id === projectId)[0];
    return returnProject;
  }
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
  const { value } = await Preferences.get({ key });
  return value;
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
