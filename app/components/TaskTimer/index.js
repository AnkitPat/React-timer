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

function TaskTimer({ timerStatus, deleteTask, stopTask }) {
  const classes = useStyles();

  const [status, setStatus] = useState(true);
  const [deleteClick, setDeleteClick] = useState(false);
  const [startTime, setStartTime] = useState('');

  function startTimer() {
    setStatus(false);
    setStartTime(new Date());
  }

  function deleteTimer() {
    setStatus(true);
    deleteTask();
  }

  const resetTimer = async (reset, stop) => {
    await setDeleteClick(true);
    stop();
    reset();
  };

  const stopTimer = async (reset, stop) => {
    stop();
    reset();
    setStatus(true);
    if (!deleteClick) {
      stopTask(startTime, new Date());
    }
    setDeleteClick(false);
    deleteTimer();
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
                    <IconButton
                      aria-label="stop"
                      onClick={() => stopTimer(reset, stop)}
                    >
                      <StopIcon color="secondary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={async () => resetTimer(reset, stop)}
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
  stopTask: PropTypes.func,
};

export default TaskTimer;
