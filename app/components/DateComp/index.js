/**
 *
 * DateComp
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { msConversion } from '../../utils';

const useStyles = makeStyles(theme => ({
  timeSpinner: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.dark,
    fontSize: '20px',
  },
  timeSpinnerBox: {
    padding: theme.spacing(1),
  },
  timeLogTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: theme.palette.primary.dark,
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
  let totalDuration = 0;
  props.tasks.map(task => {
    totalDuration += task.duration;
    return task;
  });

  return props.tasks.length > 0 ? (
    <div className={classes.timeLogTop}>
      <div className={classes.timeLogDate}>{props.date}</div>
      <div className={classes.timeLogTotal}>
        Total:
        <div className={classes.timeSpinner}>
          <div className={classes.timeSpinnerBox}>
            {msConversion(totalDuration)}
          </div>
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
};

export default DateComp;
