/**
 *
 * Timer
 *
 */

import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Timer from 'react-compound-timer';

const useStyles = makeStyles(theme => ({
  timeSpinner: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  timeSpinnerBox: {
    padding: theme.spacing(1),
  },
  timeStartEnd: {
    display: 'flex',
    alignItems: 'center',
  },
  timeStartEndBox: {
    padding: theme.spacing(1),
  },
}));

function TaskTimer({ timerStatus, deleteTask }) {
  const classes = useStyles();

  const [status, setStatus] = useState(true);

  function startTimer() {
    setStatus(false);
  }

  function stopTimer() {
    setStatus(true);
  }

  function deleteTimer() {
    setStatus(true);
    deleteTask();
  }

  const resetTimer = (reset, stop) => {
    reset();
    stop();
  };

  return (
    <>
      <Timer
        startImmediately={false}
        onStart={() => startTimer()}
        onStop={() => stopTimer()}
        onReset={() => deleteTimer()}
      >
        {({ start, stop, reset }) => (
          <React.Fragment>
            <Box className={classes.timeRecorderBox}>
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </Box>
            <Box className={classes.timeRecorderBox}>
              <div className={classes.timeRecorderActions}>
                {timerStatus && status ? (
                  <IconButton aria-label="play" onClick={start}>
                    <PlayArrowIcon color="primary" />
                  </IconButton>
                ) : (
                  <>
                    <IconButton aria-label="stop" onClick={stop}>
                      <StopIcon color="secondary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => resetTimer(reset, stop)}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </>
                )}
              </div>
            </Box>
          </React.Fragment>
        )}
      </Timer>
    </>
  );
}

TaskTimer.propTypes = {
  timerStatus: PropTypes.bool,
  deleteTask: PropTypes.func,
};

export default TaskTimer;
