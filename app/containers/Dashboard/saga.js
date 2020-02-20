import { put, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { uuid } from 'uuidv4';
import {
  projectsLoaded,
  projectLoadingError,
  saveTaskAfterSort,
} from './actions';
import projects from './projects.json';
import {
  LOAD_PROJECTS,
  SAVE_TASK,
  DELETE_GROUP_TASK,
  DELETE_SINGLE_TASK,
  MODIFY_TASK_NAME,
  MODIFY_TASK_PROJECT_NAME,
} from './constants';
import * as selectors from './selectors';
import {
  formatDate,
  timeDifference,
  addTimes,
  substractTimes,
} from '../../utils';

/**
 * Example date set for task and storage
 *
 *
 * tasks: {
 *  2020-02-18: [{
 *      taskName: 'sampleTask1',
 *      projectName: 'sampleProject1',
 *      startTime: 'start time of parent task1',
 *      endTime: 'end time of parent task1',
 *      timer: [
 *        {
 *          startTime: 'start time of sub-task1',
 *          endTime: 'end time of sub-task1',
 *          duration: 'duration of sub-task1'
 *        },
 *        {
 *          startTime: 'start time of sub-task2',
 *          endTime: 'end time of sub-task2',
 *          duration: 'duration of sub-task2'
 *        }
 *      ],
 *      duration: 'duration of whole parent task'
 *    }],
 *  2020-02-29: [{
 *      taskName: 'sampleTask2',
 *      projectName: 'sampleProject2',
 *      startTime: 'start time of parent task2',
 *      endTime: 'end time of parent task2',
 *      timer: [
 *        {
 *          startTime: 'start time of sub-task1',
 *          endTime: 'end time of sub-task1',
 *          duration: 'duration of sub-task1'
 *        }
 *      ],
 *      duration: 'duration of whole parent task'
 *    }]
 *
 * }
 */

/**
 * Get project list from dummy json file
 *
 * @returns {Generator<*, void, ?>}
 */
export function* getProjects() {
  // Read projects from a JSON file
  const projectList = projects;

  try {
    // Call our request helper (see 'utils/request')
    yield put(projectsLoaded(projectList.projects));
  } catch (err) {
    yield put(projectLoadingError(err));
  }
}

/**
 * Sort tasks and save it as per time
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* sortAndSaveTask(action) {
  try {
    // Get all tasks from selector
    const allTasks = yield select(selectors.tasksSelector);

    // Get task of current date
    let tasks = allTasks[formatDate(new Date())] || [];
    const task = action.data;
    tasks = sortTasks(tasks, task);

    // Save tasks to specific date
    yield put(
      saveTaskAfterSort({ ...allTasks, [formatDate(new Date())]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * Method to sort tasks, merge them and divide them on conditions
 * @param {*} tasks List of all tasks
 * @param {*} task task to insert in existing list
 */
function sortTasks(tasks, task) {
  let taskExist = false;

  // Map(loop) over all existing task
  tasks = tasks.map(internalTask => {
    // Check for taskName & projectName && its time in exisiting list
    if (
      task.taskName === internalTask.taskName &&
      task.projectName === internalTask.projectName &&
      formatDate(task.startTime) === formatDate(internalTask.startTime)
    ) {
      // Check if it has contained more then 1 sub-tasks
      if (task.timer && task.timer.length > 1) {
        // if it has sub-tasks, merge it to existing sub-tasks
        internalTask.timer = internalTask.timer.concat(task.timer);
        // internalTask.duration += task.duration;  ***
        internalTask.duration = addTimes([
          internalTask.duration,
          task.duration,
        ]);
      } else {
        // if it has single sub-task or no sub-task, then concat single sub-task to existing
        internalTask.timer = internalTask.timer.concat({
          startTime: task.startTime,
          endTime: task.endTime,
          duration: timeDifference(task.startTime, task.endTime),
        });
        // internalTask.duration += timeDifference(task.startTime, task.endTime); ***

        internalTask.duration = addTimes([
          internalTask.duration,
          timeDifference(task.startTime, task.endTime),
        ]);
      }
      internalTask.endTime = task.endTime;

      taskExist = true;
    }

    // Sort the sub-tasks according to its start-time
    internalTask.timer.sort(function(a, b) {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
    internalTask.endTime = internalTask.timer[0].endTime;
    internalTask.startTime =
      internalTask.timer[internalTask.timer.length - 1].startTime;
    return internalTask;
  });

  // Condition if task is not present in existing list
  if (!taskExist) {
    if (task.timer && task.timer.length > 1) {
      task = {
        ...task,
      };
    } else {
      task = {
        ...task,
        id: uuid(),
        duration: timeDifference(task.startTime, task.endTime),
        timer: [
          {
            startTime: task.startTime,
            endTime: task.endTime,
            duration: timeDifference(task.startTime, task.endTime),
          },
        ],
      };
    }

    // Concat task to existing list
    tasks = tasks.concat(task);
  }

  tasks.sort(function(a, b) {
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });
  return tasks;
}

/**
 * delete single task and save it
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* deleteSingleTask(action) {
  try {
    // Get all tasks(all-dates) from selector
    const allTasks = yield select(selectors.tasksSelector);

    // Get all tasks for date of action
    let tasks = allTasks[action.data.currentDate] || [];
    const { taskId, taskName } = action.data;
    const { startTime } = action.data;

    let singleTaskName = '';

    // Map(loop) over all tasks on date of action
    tasks = tasks.map(internalTask => {
      // For single task, check taskName & projectName should be match
      if (taskId === internalTask.id) {
        // Check if matched task has single task & no sub-task, save task name for next step
        if (internalTask.timer.length === 1) singleTaskName = taskName;

        // Filter the specific sub-task from matched task
        internalTask.timer = internalTask.timer.filter(time => {
          if (time.startTime !== startTime) {
            return true;
          }
          internalTask.duration = substractTimes(
            internalTask.duration,
            time.duration,
          );
          return false;
        });
      }
      return internalTask;
    });

    // if there is no sub-task attached, filter the task from existing tasks list
    if (singleTaskName !== '') {
      tasks = tasks.filter(internalTask => taskId !== internalTask.id);
    }

    yield put(
      saveTaskAfterSort({ ...allTasks, [action.data.currentDate]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * delete Group task and save it
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* deleteGroupTask(action) {
  try {
    // Get all tasks from selector
    const allTasks = yield select(selectors.tasksSelector);

    // Get all task for date of action
    let tasks = allTasks[action.data.date] || [];
    const { taskId } = action.data;

    // if deletion is on Group task, just single filter it out
    tasks = tasks.filter(internalTask => {
      if (taskId === internalTask.id) {
        return false;
      }
      return true;
    });

    yield put(saveTaskAfterSort({ ...allTasks, [action.data.date]: tasks }));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Modify task name
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* modifyTaskName(action) {
  try {
    const allTasks = yield select(selectors.tasksSelector);
    let tasks = allTasks[action.data.currentDate] || [];
    const { taskId, newTaskName, isPartOfGroup, startTime } = action.data;

    if (isPartOfGroup) {
      let newTask = {};
      tasks = tasks.map(internalTask => {
        if (taskId === internalTask.id) {
          // Logic to get out time entry from timer array
          internalTask.timer = internalTask.timer.filter(time => {
            if (time.startTime === startTime) {
              // created a new task for single timer entry that matched, to remove it from its group(parent task)
              newTask = {
                id: uuid(),
                taskName: newTaskName,
                projectName: internalTask.projectName,
                startTime: time.startTime,
                endTime: time.endTime,
                duration: timeDifference(time.startTime, time.endTime),
                timer: [
                  {
                    startTime: time.startTime,
                    endTime: time.endTime,
                    duration: timeDifference(time.startTime, time.endTime),
                  },
                ],
              };

              // decreament total duration of internal subtask times
              internalTask.duration = substractTimes(
                internalTask.duration,
                time.duration,
              );
              return false;
            }
            return true;
          });
        }
        return internalTask;
      });
      tasks = sortTasks(tasks, newTask);
    } else {
      // if it is not a part of group/parent task, then its single task. So directly removed from list of existing task by task name and start time
      let taskToEdit = {};
      tasks = tasks.filter(internalTask => {
        if (taskId === internalTask.id) {
          internalTask.taskName = newTaskName;
          taskToEdit = internalTask;
          return false;
        }
        return true;
      });

      tasks = sortTasks(tasks, taskToEdit);
    }
    yield put(
      saveTaskAfterSort({ ...allTasks, [action.data.currentDate]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * Modify task project name
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* modifyTaskProjectName(action) {
  try {
    // Get all tasks from seletor
    const allTasks = yield select(selectors.tasksSelector);

    // Get all task for date of action
    let tasks = allTasks[action.data.currentDate] || [];
    const { taskId, newProjectName, isPartOfGroup, startTime } = action.data;

    // if its part of group/parent task
    if (isPartOfGroup) {
      let newTask = {};
      tasks = tasks.map(internalTask => {
        if (taskId === internalTask.id) {
          // Logic to get out time entry from timer array
          internalTask.timer = internalTask.timer.filter(time => {
            if (time.startTime === startTime) {
              // created a new task for single timer entry that matched
              newTask = {
                id: uuid(),
                taskName: internalTask.taskName,
                projectName: newProjectName,
                startTime: time.startTime,
                endTime: time.endTime,
                duration: timeDifference(time.startTime, time.endTime),
                timer: [
                  {
                    startTime: time.startTime,
                    endTime: time.endTime,
                    duration: timeDifference(time.startTime, time.endTime),
                  },
                ],
              };
              // decreament total duration of internal subtask times
              internalTask.duration = substractTimes(
                internalTask.duration,
                time.duration,
              );
              return false;
            }
            return true;
          });
        }
        return internalTask;
      });
      tasks = sortTasks(tasks, newTask);
    } else {
      let taskToEdit = {};

      // filter the task from existing task list
      tasks = tasks.filter(internalTask => {
        // check the project name and start time as well
        if (taskId === internalTask.id) {
          internalTask.projectName = newProjectName;
          taskToEdit = internalTask;
          return false;
        }
        return true;
      });

      tasks = sortTasks(tasks, taskToEdit);
    }
    yield put(
      saveTaskAfterSort({ ...allTasks, [action.data.currentDate]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* dashboardSaga() {
  yield takeLatest(LOAD_PROJECTS, getProjects);
  yield takeLatest(SAVE_TASK, sortAndSaveTask);
  yield takeLatest(DELETE_SINGLE_TASK, deleteSingleTask);
  yield takeLatest(DELETE_GROUP_TASK, deleteGroupTask);
  yield takeLatest(MODIFY_TASK_NAME, modifyTaskName);
  yield takeLatest(MODIFY_TASK_PROJECT_NAME, modifyTaskProjectName);
}
