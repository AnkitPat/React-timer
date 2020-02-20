import { makeSelectLoading } from '../selectors';

describe('selectLanguage', () => {
  it('should select the global state', () => {
    const globalState = {
      loading: false,
    };
    const mockedState = {
      dashboard: globalState,
    };
    expect(makeSelectLoading(mockedState)).toEqual(false);
  });
});
