import { GroupParamsType, ProjectType, SortParamsType, TaskType } from '../types';

import en from '../strings/en.json';

type stringKeys = typeof en;

export function localeToString(string: keyof stringKeys, locale: string) {
  switch (locale) {
    case 'en':
      const retString = en[string];
      if (retString) return retString;
      else return '';
    default:
      console.error('locale not found');
      return '';
  }
}

function daysInMonth(month: number, year: number) {
  const daysInMonths = [
    31,
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return daysInMonths[month];
}

/**
 * Checks if a task is due on a given date, based on the task's typeData.
 *
 * @param {TaskType} task - The task to check.
 * @param {Date} checkDate - The date to check against.
 * @returns {boolean} Whether the task is due on the given date.
 */
export function taskDue(task: TaskType, checkDate: Date): boolean {
  if (!task) return false;
  if (!task.typeData) return false;
  if (!task.typeData.name) return false;
  switch (task.typeData.name) {
    case 'single':
      return true;
    case 'everyNumDays':
      const startDate = new Date(task.createdDate);
      const dayDifference = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDifference % (task.typeData.value as number) === 0) return true;
      break;
    case 'everyDaysOfWeek':
      if ((task.typeData.value as number[]).includes(checkDate.getDay())) return true;
      break;
    case 'everyDaysOfMonth':
      if ((task.typeData.value as number[]).includes(checkDate.getDate())) return true;
      break;
    case 'onDates':
      if ((task.typeData.value as string[]).includes(checkDate.toISOString().split('T')[0])) return true;
      break;
  }
  return false;
}

/**
 * Finds the last due date for a task, given a check date.
 *
 * @param {TaskType} task - The task to find the last due date for.
 * @param {Date} checkDate - The date to check against.
 * @returns {Date} The last due date for the task.
 */
function findLastDueDate(task: TaskType, checkDate: Date): Date | undefined {
  let lastDate;
  switch (task.typeData.name) {
    /* CHECK EVERY NUM DAYS */
    case 'everyNumDays':
      // keep checking until found most recent date
      lastDate = new Date(task.createdDate);
      while (
        Math.floor((checkDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) >=
        (task.typeData.value as number)
      ) {
        lastDate.setDate(lastDate.getDate() + (task.typeData.value as number));
      }
      break;

    /* CHECK EVERY DAYS OF WEEK */
    case 'everyDaysOfWeek':
      // check if is due today
      if ((task.typeData.value as number[]).includes(checkDate.getDay())) lastDate = checkDate;
      else {
        // order required days
        let orderedDaysOfWeek = task.typeData.value as number[];
        orderedDaysOfWeek.sort((a, b) => a - b);

        // find most recent day of week
        let lastDay = orderedDaysOfWeek[0];
        orderedDaysOfWeek.forEach((day) => {
          if (day < checkDate.getDay()) lastDay = day;
          else return;
        });
        let dayDiff = checkDate.getDay() - lastDay;
        if (dayDiff < 0) dayDiff += 7;

        lastDate = new Date(checkDate.getDate() - dayDiff);
      }
      break;

    /* CHECK EVERY DAYS OF MONTH */
    case 'everyDaysOfMonth':
      // check if is due today
      if ((task.typeData.value as number[]).includes(checkDate.getDate())) lastDate = checkDate;
      else {
        // order required days descending
        let orderedDaysOfMonth = task.typeData.value as number[];
        orderedDaysOfMonth.sort((a, b) => b - a);

        // find starting day
        let checkIndex = 0;
        for (let i = 0; i < orderedDaysOfMonth.length; i++) {
          checkIndex = i;
          if (orderedDaysOfMonth[i] < checkDate.getDate()) break;
        }

        // find last valid date
        let checkingYear = checkDate.getFullYear();
        let checkingMonth = checkDate.getMonth();
        let checkingDate = orderedDaysOfMonth[checkIndex];
        while (
          new Date(checkingYear, checkingMonth - 1, checkingDate + 1).getTime() >= new Date(task.createdDate).getTime()
        ) {
          checkingDate = orderedDaysOfMonth[checkIndex];
          // check if date valid, date is not in future and month as date
          if (
            !(checkingDate > daysInMonth(checkingYear, checkingMonth)) &&
            !(new Date(checkingYear, checkingMonth, checkingDate).getTime() > checkDate.getTime())
          ) {
            lastDate = new Date(checkingYear, checkingMonth - 1, checkingDate + 1);
            break;
          } else {
            // check next day
            checkIndex++;
          }

          // if wrapping
          if (checkIndex >= orderedDaysOfMonth.length) {
            checkIndex = 0;
            // check next month
            checkingMonth--;
            if (checkingMonth < 0) {
              checkingMonth = 11;
              checkingYear--;
            }
          }
        }
      }
      break;

    /* CHECK ON DATES */
    case 'onDates':
      // order dates
      let orderedDates = task.typeData.value as string[];
      orderedDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // find last date
      lastDate = new Date(orderedDates[0]);
      orderedDates.forEach((date) => {
        if (new Date(date).getTime() < checkDate.getTime()) lastDate = new Date(date);
        else return;
      });
      break;
  }

  return lastDate;
}

/**
 * Checks if a task is overdue on a given date, based on the task's typeData.
 *
 * @param {TaskType} task - The task to check.
 * @param {Date} checkDate - The date to check against.
 * @returns {boolean} Whether the task is overdue on the given date.
 */
export function taskOverdue(task: TaskType, checkDate: Date): boolean {
  if (!task) return false;
  if (!task.typeData) return false;
  if (!task.typeData.name) return false;

  if (task.typeData.name === 'single') return task.typeData.completedOnDates.length === 0;
  else {
    const lastDate = findLastDueDate(task, checkDate);
    if (!lastDate) return true;
    return !task.typeData.completedOnDates.includes(lastDate.toISOString().split('T')[0]);
  }
}

export function sortTasks(tasks: TaskType[], sortParam: SortParamsType, sortDesc?: boolean): TaskType[] {
  if (!sortParam || sortParam === ('' as SortParamsType)) return tasks;
  const sortParamKey = sortParam as keyof TaskType;
  let sortedTasks = tasks.sort((a: TaskType, b: TaskType) => {
    if (a[sortParamKey] < b[sortParamKey]) return -1 * (sortDesc ? -1 : 1);
    if (a[sortParamKey] > b[sortParamKey]) return 1 * (sortDesc ? -1 : 1);
    if (a.name < b.name) return -1 * (sortDesc ? -1 : 1);
    if (a.name > b.name) return 1 * (sortDesc ? -1 : 1);
    return 0;
  });
  return sortedTasks;
}

export function sortTaskGroups(
  groupedTasks: { [key: string]: TaskType[] },
  sortParam: SortParamsType,
  sortDesc?: boolean,
): { [key: string]: TaskType[] } {
  if (!sortParam || sortParam === ('' as SortParamsType)) return groupedTasks;
  const sortParamKey = sortParam as keyof TaskType;
  const keys = Object.keys(groupedTasks);
  keys.forEach((key) => {
    groupedTasks[key] = groupedTasks[key].sort((a: TaskType, b: TaskType) => {
      if (a[sortParamKey] < b[sortParamKey]) return -1 * (sortDesc ? -1 : 1);
      if (a[sortParamKey] > b[sortParamKey]) return 1 * (sortDesc ? -1 : 1);
      if (a.name < b.name) return -1 * (sortDesc ? -1 : 1);
      if (a.name > b.name) return 1 * (sortDesc ? -1 : 1);
      return 0;
    });
  });
  return groupedTasks;
}

/**
 * Group tasks by a given parameter.
 *
 * @param {TaskType[]} tasks - The array of tasks to group.
 * @param {GroupParamsType} groupParam - The parameter to group tasks by.
 * @param {ProjectType[]} [projects] - The array of projects to check for task
 *   associations with.
 *
 * @returns {{ [key: string]: TaskType[] }} - An object where the keys are the
 *   group values and the values are arrays of tasks in that group.
 */
export function groupTasks(
  tasks: TaskType[],
  groupParam: GroupParamsType,
  projects?: ProjectType[],
): { [key: string]: TaskType[] } {
  const groupedTasks = tasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
    let groupValue;
    switch (groupParam) {
      case 'createdDate':
        groupValue = task.createdDate;
        break;
      case 'typeData':
        groupValue = task.typeData.name;
        break;
      case 'projectName':
        if (!projects) groupValue = task.createdDate;
        else {
          groupValue = task.createdDate;
          projects.forEach((project) => {
            if (project.taskIds.includes(task.id)) groupValue = project.name;
          });
        }
        break;
      default:
        console.error('Error: invalid group parameter');
        groupValue = task.createdDate;
        break;
    }
    if (!acc[groupValue]) {
      acc[groupValue] = [];
    }
    acc[groupValue].push(task);
    return acc;
  }, {});
  return groupedTasks;
}
