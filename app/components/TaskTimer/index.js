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

function TaskTimer({ timerStatus, deleteTask, stopTask, restart }) {
  const classes = useStyles();

  // const [status, setStatus] = useState(true);
  const [deleteClick, setDeleteClick] = useState(false);
  // const [startTime, setStartTime] = useState('');

  const [time, setTime] = useState({
    startTime: '',
    status: true,
    restartValue: true,
  });
  useEffect(() => {
    if (time.restartValue && restart) {
      // setStartTime(new Date());

      // setStatus(false)

      setTime({ startTime: new Date(), status: false, restartValue: false });
    }
  });

  async function startTimer() {
    // setStatus(false);
    // await setStartTime(new Date());
    setTime({ startTime: new Date(), status: false, restartValue: true });
  }

  function deleteTimer() {
    // setStatus(true);

    setTime({ ...time, status: true, restartValue: true });

    deleteTask();
  }

  const resetTimer = async (reset, stop) => {
    await setDeleteClick(true);
    stop();
    reset();
  };

  const stopTimer = () => {
    // setStatus(true);

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
            <Box className={classes.timeRecorderBox}>
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </Box>
            <Box className={classes.timeRecorderBox}>
              <div className={classes.timeRecorderActions}>
                {timerStatus && time.status ? (
                  <IconButton aria-label="play" onClick={start}>
                    <PlayArrowIcon color="primary" />
                  </IconButton>
                ) : (
                  <>
                    <IconButton
                      aria-label="stop"
                      onClick={() => {
                        stop();
                        reset();
                      }}
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
  restart: PropTypes.bool,
};

export default TaskTimer;
