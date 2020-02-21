/**
 *
 * Timer
 *
 */

import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import Timer from 'react-compound-timer';
import { useStyles } from './index.styles';

const TaskTimer = ({
  timerStatus,
  timerStarted,
  deleteTask,
  stopTask,
  restart,
  unique,
  enter,
  taskName,
  projectName,
}) => {
  const classes = useStyles();
  const [deleteClick, setDeleteClick] = useState(false);
  const [time, setTime] = useState({
    startTime: '',
    status: true,
    restartValue: true,
    timeOfStart: '',
  });

  useEffect(() => {
    if (restart) {
      if (!time.status) {
        stopTimer(taskName, projectName, false);
      }
      setTime({
        startTime: new Date(),
        status: false,
        restartValue: false,
        timeOfStart: unique,
      });
    }

    if (enter)
      setTime({
        startTime: new Date(),
        status: false,
        restartValue: false,
        timeOfStart: unique,
      });
  }, [unique, enter]);

  /* eslint-disable */

  useEffect(() => {
    if (!time.status || !timerStatus) {
      window.addEventListener('beforeunload', ev => {
        ev.preventDefault();
        return (ev.returnValue = 'Are you sure you want to close?');
      });
    } else {
      window.removeEventListener('beforeunload', ev => {
        ev.preventDefault();
        return (ev.returnValue = 'Are you sure you want to close?');
      });
    }
  });

  function startTimer() {
    timerStarted();
    setTime({ startTime: new Date(), status: false, restartValue: false });
  }

  function deleteTimer() {
    setTime({ ...time, status: true, restartValue: true });
    deleteTask();
  }

  const resetTimer = async (reset, stop) => {
    await setDeleteClick(true);
    stop();
    reset();
  };

  const stopTimer = (taskName, projectName, stopTimerInstance) => {
    setTime({ ...time, status: true, restartValue: true });
    if (!deleteClick) {
      stopTask(taskName, projectName,time.startTime, new Date(), stopTimerInstance);
    }
    setDeleteClick(false);
    if (stopTimerInstance) deleteTimer();
  };

  return (
    <>
      <Timer
        key={restart + unique}
        startImmediately={restart}
        onStart={() => {
          startTimer();
        }}
        onStop={() => stopTimer(taskName, projectName, true)}
        onReset={() => deleteTimer()}
        formatValue={value => `${value < 10 ? `0${value}` : value}`}
      >
        {({ start, stop, reset }) => (
          <React.Fragment>
            <Box className={[classes.timeRecorderBox, classes.timeSpinner]}>
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </Box>
            <Box className={classes.timeRecorderBox}>
              <div className={classes.timeRecorderActions}>
                {timerStatus && time.status ? (
                  <IconButton
                    className={classes.btnOverlay}
                    aria-label="play"
                    onClick={start}
                  >
                    <PlayArrowIcon fontSize="large" color="secondary" />
                  </IconButton>
                ) : (
                  <>
                    <IconButton
                      className={classes.btnOverlay}
                      aria-label="stop"
                      onClick={() => {
                        stop();
                        reset();
                      }}
                    >
                      <StopIcon fontSize="large" color="error" />
                    </IconButton>
                    <IconButton
                      className={classes.btnDelete}
                      aria-label="delete"
                      onClick={async () => resetTimer(reset, stop)}
                    >
                      <DeleteIcon fontSize="small" />
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
};

TaskTimer.propTypes = {
  timerStatus: PropTypes.bool,
  deleteTask: PropTypes.func,
  stopTask: PropTypes.func,
  restart: PropTypes.bool,
  timerStarted: PropTypes.func,
  unique: PropTypes.string,
  enter: PropTypes.bool,
  taskName: PropTypes.string,
  projectName: PropTypes.string,
};

export default TaskTimer;
