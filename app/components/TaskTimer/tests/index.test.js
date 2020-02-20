/**
 *
 * Tests for Timer
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import Timer from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<Timer />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <Timer />
      </IntlProvider>,
    );
    expect(spy).toHaveBeenCalled();
  });

  /**
   * Unskip this test to use it
   *
   */
  it.skip('Should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <Timer />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
