/**
 *
 * DateComp
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { msConversion, translateLanguage, addTimes } from '../../utils';

const useStyles = makeStyles(theme => ({
  timeSpinner: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  timeSpinnerBox: {
    padding: theme.spacing(1),
  },
  timeLogTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '18px',
  },
  timeLogTotal: {
    display: 'flex',
    alignItems: 'center',
  },
  timeLogPanel: {
    position: 'relative',
  },
}));

function DateComp(props) {
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
}

DateComp.propTypes = {
  tasks: PropTypes.array,
  date: PropTypes.string,
  intl: PropTypes.any,
};

export default injectIntl(DateComp);
