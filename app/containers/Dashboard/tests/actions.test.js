import { loadProjects } from '../actions';

import { LOAD_PROJECTS } from '../constants';

describe('Dashboard actions', () => {
  describe('Load Projet Action', () => {
    it('has a type of LOAD_PROJECTS', () => {
      const expected = {
        type: LOAD_PROJECTS,
      };
      expect(loadProjects()).toEqual(expected);
    });
  });
});
