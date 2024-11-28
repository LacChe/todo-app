import mockProjectLists from './mockData/projectLists.json';
import mockProjects from './mockData/projects.json';

export function getUserId() {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    return 'user-0000';
  } else {
    // TODO load real data
    console.log('TODO load real data');
    return 'user-0000';
  }
}

export function getProjectList(userId: string) {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    return mockProjectLists[0];
  } else {
    // TODO load real data
    console.log('TODO load real data');
    return mockProjectLists[0];
  }
}

export function getProjects(userId: string) {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    const returnProjects = mockProjects.filter((project) =>
      mockProjectLists[0].projectIds.includes(project.id),
    );
    return returnProjects;
  } else {
    // TODO load real data
    console.log('TODO load real data');
    const returnProjects = mockProjects.filter((project) =>
      mockProjectLists[0].projectIds.includes(project.id),
    );
    return returnProjects;
  }
}

export function getProject(projectId: string) {
  if (import.meta.env.VITE_MOCK_DATA_MODE) {
    const returnProject = mockProjects.filter(
      (project) => project.id === projectId,
    )[0];
    return returnProject;
  } else {
    // TODO load real data
    console.log('TODO load real data');
    const returnProject = mockProjects.filter(
      (project) => project.id === projectId,
    )[0];
    return returnProject;
  }
}
