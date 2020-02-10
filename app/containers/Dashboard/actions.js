/*
 *
 * Dashboard actions
 *
 */

import {
  LOAD_PROJECTS,
  LOAD_PROJECTS_ERROR,
  LOAD_PROJECTS_SUCCESS,
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
