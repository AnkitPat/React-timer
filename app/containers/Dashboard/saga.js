import { put, takeLatest } from '@redux-saga/core/effects';
import { projectsLoaded, projectLoadingError } from './actions';
import projects from './projects.json';
import { LOAD_PROJECTS } from './constants';

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
 * Root saga manages watcher lifecycle
 */
export default function* dashboardSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_PROJECTS, getProjects);
}
