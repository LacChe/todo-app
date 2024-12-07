import { TaskType } from '../types';

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
  if (!task.typeData.value) return false;
  console.log(task.typeData);
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

export function takCurrentlyCompleted(task: TaskType, checkDate: Date): boolean {
  return true;
}
