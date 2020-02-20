import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboard state domain
 */

const selectDashboardDomain = state => state.dashboard || initialState;

/**
 * Default selector used by Dashboard
 */

const makeSelectProjects = () =>
  createSelector(
    selectDashboardDomain,
    dashboardState => dashboardState.projects,
  );

const makeSelectLoading = () =>
  createSelector(
    selectDashboardDomain,
    dashboardState => dashboardState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectDashboardDomain,
    dashboardState => dashboardState.error,
  );

const makeSelectTasks = () =>
  createSelector(
    selectDashboardDomain,
    dashboardState => dashboardState.tasks,
  );

const makeRestartTaskData = () =>
  createSelector(
    selectDashboardDomain,
    dashboardState => dashboardState.restartTaskData,
  );

export const tasksSelector = createSelector(
  selectDashboardDomain,
  dashboardState => dashboardState.tasks,
);

export {
  selectDashboardDomain,
  makeSelectProjects,
  makeSelectLoading,
  makeSelectError,
  makeSelectTasks,
  makeRestartTaskData,
};
