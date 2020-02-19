import { put, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
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
import { formatDate } from '../../utils';

// import { take, call, put, select } from 'redux-saga/effects';

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
    const allTasks = yield select(selectors.tasksSelector);
    let tasks = allTasks[formatDate(new Date())] || [];
    const task = action.data;
    tasks = sortTasks(tasks, task);
    yield put(
      saveTaskAfterSort({ ...allTasks, [formatDate(new Date())]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

function sortTasks(tasks, task) {
  let taskExist = false;

  tasks = tasks.map(internalTask => {
    if (
      task.taskName === internalTask.taskName &&
      task.projectName === internalTask.projectName &&
      formatDate(task.startTime) === formatDate(internalTask.startTime)
    ) {
      if (task.timer && task.timer.length > 1) {
        internalTask.timer = internalTask.timer.concat(task.timer);
        internalTask.duration += task.duration;
      } else {
        internalTask.timer = internalTask.timer.concat({
          startTime: task.startTime,
          endTime: task.endTime,
          duration: Math.abs(new Date(task.startTime) - new Date(task.endTime)),
        });
        internalTask.duration += Math.abs(
          new Date(task.startTime) - new Date(task.endTime),
        );
      }
      internalTask.endTime = task.endTime;

      taskExist = true;
    }
    internalTask.timer.sort(function(a, b) {
      return a.startTime - b.startTime;
    });
    internalTask.startTime = internalTask.timer[0].startTime;
    internalTask.endTime =
      internalTask.timer[internalTask.timer.length - 1].endTime;
    return internalTask;
  });

  if (!taskExist) {
    if (task.timer && task.timer.length > 1) {
      task = {
        ...task,
      };
    } else {
      task = {
        ...task,
        duration: Math.abs(new Date(task.startTime) - new Date(task.endTime)),
        timer: [
          {
            startTime: task.startTime,
            endTime: task.endTime,
            duration: Math.abs(
              new Date(task.startTime) - new Date(task.endTime),
            ),
          },
        ],
      };
    }

    tasks = tasks.concat(task);
  }

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
    const allTasks = yield select(selectors.tasksSelector);
    let tasks = allTasks[action.data.currentDate] || [];
    const { taskName } = action.data;
    const { startTime, projectName } = action.data;

    let singleTaskName = '';
    console.log(taskName, startTime);
    tasks = tasks.map(internalTask => {
      if (
        taskName === internalTask.taskName &&
        projectName === internalTask.projectName
      ) {
        if (internalTask.timer.length === 1) singleTaskName = taskName;
        internalTask.timer = internalTask.timer.filter(time => {
          if (time.startTime !== startTime) {
            return true;
          }
          internalTask.duration -= time.duration;
          return false;
        });
      }
      return internalTask;
    });

    if (singleTaskName !== '') {
      tasks = tasks.filter(
        internalTask =>
          taskName !== internalTask.taskName ||
          projectName !== internalTask.projectName,
      );
    }

    yield put(
      saveTaskAfterSort({ ...allTasks, [action.data.currentDate]: tasks }),
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * delete single task and save it
 *
 * @returns {Generator<*, void, ?>}
 */
/* eslint-disable default-case, no-param-reassign */

export function* deleteGroupTask(action) {
  try {
    const allTasks = yield select(selectors.tasksSelector);
    let tasks = allTasks[action.data.date] || [];
    const { taskName, projectName } = action.data;

    tasks = tasks.filter(internalTask => {
      if (
        taskName === internalTask.taskName &&
        projectName === internalTask.projectName
      ) {
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
    const { taskName, newTaskName, isPartOfGroup, startTime } = action.data;

    if (isPartOfGroup) {
      let newTask = {};
      tasks = tasks.map(internalTask => {
        if (taskName === internalTask.taskName) {
          // Logic to get out time entry from timer array
          internalTask.timer = internalTask.timer.filter(time => {
            if (time.startTime === startTime) {
              // created a new task for single timer entry that matched
              newTask = {
                taskName: newTaskName,
                projectName: internalTask.projectName,
                startTime: time.startTime,
                endTime: time.endTime,
                duration: Math.abs(
                  new Date(time.startTime) - new Date(time.endTime),
                ),
                timer: [
                  {
                    startTime: time.startTime,
                    endTime: time.endTime,
                    duration: Math.abs(
                      new Date(time.startTime) - new Date(time.endTime),
                    ),
                  },
                ],
              };

              // decreament total duration of internal subtask times
              internalTask.duration -= time.duration;
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
      tasks = tasks.filter(internalTask => {
        if (
          taskName === internalTask.taskName &&
          startTime === internalTask.startTime
        ) {
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
    const allTasks = yield select(selectors.tasksSelector);
    let tasks = allTasks[action.data.currentDate] || [];
    const {
      projectName,
      newProjectName,
      isPartOfGroup,
      startTime,
    } = action.data;

    if (isPartOfGroup) {
      let newTask = {};
      tasks = tasks.map(internalTask => {
        if (projectName === internalTask.projectName) {
          // Logic to get out time entry from timer array
          internalTask.timer = internalTask.timer.filter(time => {
            if (time.startTime === startTime) {
              // created a new task for single timer entry that matched
              newTask = {
                taskName: internalTask.taskName,
                projectName: newProjectName,
                startTime: time.startTime,
                endTime: time.endTime,
                duration: Math.abs(
                  new Date(time.startTime) - new Date(time.endTime),
                ),
                timer: [
                  {
                    startTime: time.startTime,
                    endTime: time.endTime,
                    duration: Math.abs(
                      new Date(time.startTime) - new Date(time.endTime),
                    ),
                  },
                ],
              };
              // decreament total duration of internal subtask times
              internalTask.duration -= time.duration;
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
      tasks = tasks.filter(internalTask => {
        // check the project name and start time as well
        if (
          projectName === internalTask.projectName &&
          startTime === internalTask.startTime
        ) {
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
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_PROJECTS, getProjects);
  yield takeLatest(SAVE_TASK, sortAndSaveTask);
  yield takeLatest(DELETE_SINGLE_TASK, deleteSingleTask);
  yield takeLatest(DELETE_GROUP_TASK, deleteGroupTask);
  yield takeLatest(MODIFY_TASK_NAME, modifyTaskName);
  yield takeLatest(MODIFY_TASK_PROJECT_NAME, modifyTaskProjectName);
}
