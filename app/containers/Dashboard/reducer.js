/*
 *
 * Dashboard reducer
 *
 */
import produce from 'immer';
import {
  LOAD_PROJECTS,
  LOAD_PROJECTS_SUCCESS,
  LOAD_PROJECTS_ERROR,
  SAVE_TASK_AFTER_SORT,
  RESTART_TASK,
} from './constants';

export const initialState = {
  loading: false,
  projects: [],
  error: false,
  tasks: {},
  restartTaskData: { taskName: undefined, project: undefined },
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_PROJECTS:
        draft.loading = true;
        break;
      case LOAD_PROJECTS_SUCCESS:
        draft.loading = false;
        draft.projects = action.projects;
        break;
      case LOAD_PROJECTS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case SAVE_TASK_AFTER_SORT:
        draft.tasks = action.data;
        draft.restartTaskData = { taskName: undefined, project: undefined };
        break;
      case RESTART_TASK:
        draft.restartTaskData = {
          taskName: action.data.taskName,
          project: action.data.project,
        };
        break;
    }
  });

export default dashboardReducer;
