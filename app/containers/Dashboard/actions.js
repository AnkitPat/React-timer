/*
 *
 * Dashboard actions
 *
 */

import {
  LOAD_PROJECTS,
  LOAD_PROJECTS_ERROR,
  LOAD_PROJECTS_SUCCESS,
  SAVE_TASK,
  SAVE_TASK_AFTER_SORT,
  RESTART_TASK,
  DELETE_SINGLE_TASK,
  DELETE_GROUP_TASK,
} from './constants';

/**
 * Load the projects
 *
 * @returns {{type: string}}
 */
export function loadProjects() {
  return {
    type: LOAD_PROJECTS,
  };
}

/**
 * Dispatched when the projects are loaded by the request saga
 *
 * @param projects
 * @returns {{projects: *, type: string}}
 */
export function projectsLoaded(projects) {
  return {
    type: LOAD_PROJECTS_SUCCESS,
    projects,
  };
}

/**
 * Dispatched when loading the projects fails
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function projectLoadingError(error) {
  return {
    type: LOAD_PROJECTS_ERROR,
    error,
  };
}

/**
 * Dispatched when task saved
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function sortTask(data) {
  return {
    type: SAVE_TASK,
    data,
  };
}

/**
 * Dispatched when task sort and save it
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function saveTaskAfterSort(data) {
  return {
    type: SAVE_TASK_AFTER_SORT,
    data,
  };
}

/**
 * Dispatched when restart task
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function restartTask(data) {
  return {
    type: RESTART_TASK,
    data,
  };
}

/**
 * Dispatched when delete single taskl
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function deleteSingleTask(data) {
  return {
    type: DELETE_SINGLE_TASK,
    data,
  };
}

/**
 * Dispatched when delete group task
 *
 * @param error
 * @returns {{type: string, error: *}}
 */
export function deleteGroupTask(data) {
  return {
    type: DELETE_GROUP_TASK,
    data,
  };
}
