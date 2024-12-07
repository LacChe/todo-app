import { TaskType } from '../types';

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
  if (!task.typeData.value) return false;
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
      // TODO check if past dates return correctly
      if ((task.typeData.value as string[]).includes(checkDate.toISOString().split('T')[0])) return true;
      break;
  }
  return false;
}

export function taskOverdue(task: TaskType, checkDate: Date): boolean {
  if (!task) return false;
  if (!task.typeData) return false;
  if (!task.typeData.name) return false;
  if (!task.typeData.value) return false;
  let lastDate;
  switch (task.typeData.name) {
    case 'single':
      return task.typeData.completedOnDates.length > 0;
    case 'everyNumDays':
      // keep checking until found most recent date
      lastDate = new Date(task.createdDate);
      while (
        Math.floor((checkDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) >=
        (task.typeData.value as number)
      ) {
        lastDate.setDate(lastDate.getDate() + (task.typeData.value as number));
        console.log('checking', lastDate.toISOString().split('T')[0]);
      }
      lastDate = lastDate.toISOString().split('T')[0];

      // check if last date is complete
      return !task.typeData.completedOnDates.includes(lastDate);
    case 'everyDaysOfWeek':
      // check if is due today
      if ((task.typeData.value as number[]).includes(checkDate.getDay()))
        lastDate = checkDate.toISOString().split('T')[0];
      else {
        // order required days
        let orderedDaysOfWeek = task.typeData.value as number[];
        if (orderedDaysOfWeek.length === 0) return true;
        orderedDaysOfWeek.sort((a, b) => a - b);

        // find most recent day of week
        let lastDay = orderedDaysOfWeek[0];
        orderedDaysOfWeek.forEach((day) => {
          if (day < checkDate.getDay()) lastDay = day;
          else return;
        });
        let dayDiff = checkDate.getDay() - lastDay;
        if (dayDiff < 0) dayDiff += 7;

        lastDate = new Date(checkDate.getDate() - dayDiff).toISOString().split('T')[0];
      }
      // check if last date is complete
      return !task.typeData.completedOnDates.includes(lastDate);
    case 'everyDaysOfMonth':
      // check if is due today
      if ((task.typeData.value as number[]).includes(checkDate.getDate()))
        lastDate = checkDate.toISOString().split('T')[0];
      else {
        // order required days descending
        let orderedDaysOfMonth = task.typeData.value as number[];
        if (orderedDaysOfMonth.length === 0) return true;
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
          new Date(checkingYear, checkingMonth, checkingDate + 1).getTime() >= new Date(task.createdDate).getTime()
        ) {
          // if month does not have day
          if (checkingDate > daysInMonth(checkingYear, checkingMonth)) {
            // check next day
            checkIndex++;
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
            continue;
          }
          lastDate = new Date(checkingYear, checkingMonth, checkingDate + 1).toISOString().split('T')[0];
          break;
        }
      }

      // check if last date is complete
      if (!lastDate) return true;
      return !task.typeData.completedOnDates.includes(lastDate);
    case 'onDates':
      // order dates
      let orderedDates = task.typeData.value as string[];
      if (orderedDates.length === 0) return true;
      orderedDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // find last date
      lastDate = orderedDates[0];
      orderedDates.forEach((date) => {
        if (new Date(date).getTime() < checkDate.getTime()) lastDate = date;
        else return;
      });

      // check if last date is complete
      return !task.typeData.completedOnDates.includes(lastDate);
  }
}
