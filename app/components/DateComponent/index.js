/**
 *
 * Date Component to show date and total time
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { translateLanguage, addTimes } from '../../utils';
import { useStyles } from './index.styles';

const DateComponent = props => {
  const classes = useStyles();
  let totalDuration = '00:00:00';
  props.tasks.map(task => {
    totalDuration = addTimes([task.duration, totalDuration]);
    return task;
  });

  return props.tasks.length > 0 ? (
    <div className={classes.timeLogTop}>
      <div className={classes.timeLogDate}>{props.date}</div>
      <div className={classes.timeLogTotal}>
        {translateLanguage(props.intl, 'dashboard.totalTimePlaceholder')}
        <div className={classes.timeSpinner}>
          <div className={classes.timeSpinnerBox}>{totalDuration}</div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

DateComponent.propTypes = {
  tasks: PropTypes.array,
  date: PropTypes.string,
  intl: PropTypes.any,
};

export default injectIntl(DateComponent);
