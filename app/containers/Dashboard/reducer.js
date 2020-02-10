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
} from './constants';

export const initialState = {
  loading: false,
  projects: [],
  error: false,
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
    }
  });

export default dashboardReducer;
