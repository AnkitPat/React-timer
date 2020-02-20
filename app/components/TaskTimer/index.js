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

const TaskTimer = ({ timerStatus, deleteTask, stopTask, restart }) => {
  const classes = useStyles();
  const [deleteClick, setDeleteClick] = useState(false);
  const [time, setTime] = useState({
    startTime: '',
    status: true,
    restartValue: true,
  });

  useEffect(() => {
    if (time.restartValue && restart) {
      setTime({ startTime: new Date(), status: false, restartValue: false });
    }
  });

  async function startTimer() {
    setTime({ startTime: new Date(), status: false, restartValue: true });
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

  const stopTimer = () => {
    setTime({ ...time, status: true, restartValue: true });
    if (!deleteClick) {
      stopTask(time.startTime, new Date());
    }
    setDeleteClick(false);
    deleteTimer();
  };

  return (
    <>
      <Timer
        key={restart}
        startImmediately={restart}
        onStart={() => startTimer()}
        onStop={() => stopTimer()}
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
};

export default TaskTimer;
