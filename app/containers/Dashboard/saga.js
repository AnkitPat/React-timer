import { put, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import {
  projectsLoaded,
  projectLoadingError,
  saveTaskAfterSort,
} from './actions';
import projects from './projects.json';
import { LOAD_PROJECTS, SAVE_TASK } from './constants';
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
    let task = action.data;
    let taskExist = false;

    tasks = tasks.map(internalTask => {
      if (
        task.taskName === internalTask.taskName &&
        formatDate(task.startTime) === formatDate(internalTask.startTime)
      ) {
        internalTask.timer = internalTask.timer.concat({
          startTime: task.startTime,
          endTime: task.endTime,
        });
        internalTask.endTime = task.endTime;
        taskExist = true;
      }
      return internalTask;
    });

    if (!taskExist) {
      task = {
        ...task,
        timer: [{ startTime: task.startTime, endTime: task.endTime }],
      };
      tasks = tasks.concat(task);
    }
    yield put(
      saveTaskAfterSort({ ...allTasks, [formatDate(new Date())]: tasks }),
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
}
