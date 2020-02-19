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
  timeRecorderBox: {
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2),
    },
  },
  btnOverlay: {
    backgroundColor: 'rgba(0,0,0,.06)',
  },
  timeSpinner: {
    [theme.breakpoints.up('lg')]: {
      fontSize: '24px',
      color: theme.palette.primary.dark,
    },
  },
  btnDelete: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
    },
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
}

TaskTimer.propTypes = {
  timerStatus: PropTypes.bool,
  deleteTask: PropTypes.func,
  stopTask: PropTypes.func,
  restart: PropTypes.bool,
};

export default TaskTimer;
