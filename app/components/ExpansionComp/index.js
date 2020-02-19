/**
 *
 * ExpansionComp
 *
 */

import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  loadProjects,
  restartTask,
  deleteGroupTask,
  modifyTaskName,
  modifyTaskProjectName,
} from '../../containers/Dashboard/actions';
import ProjectsList from '../ProjectsList';
import { makeSelectProjects } from '../../containers/Dashboard/selectors';
import { getProjects } from '../../containers/Dashboard/saga';
import { formatTime, msConversion } from '../../utils';

const useStyles = makeStyles(theme => ({
  timeRecorder: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
    },
    [theme.breakpoints.up('lg')]: {
      padding: `0 ${theme.spacing(1)}px`,
    },
  },
  timeRecorderBox: {
    padding: theme.spacing(1),
  },
  taskNameBox: {
    width: 'calc(100% - 120px)',
    maxWidth: 'calc(100% - 120px)',
    flex: '0 0 calc(100% - 120px)',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      maxWidth: '100%',
      flex: '1 0 auto',
    },
  },
  projectBox: {
    width: '120px',
    maxWidth: '120px',
    flex: '0 0 120px',
    [theme.breakpoints.up('sm')]: {
      width: '150px',
      maxWidth: '150px',
      flex: '0 0 150px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '250px',
      maxWidth: '250px',
      flex: '0 0 250px',
    },
  },
  timeSpinner: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(.5),
    borderRadius: '4px',
    fontSize: '12px',
  },
  startEndBox: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      order: '1',
    },
    [theme.breakpoints.up('md')]: {
      order: '0',
      width: 'auto',
    },
  },

  divider: {
    padding: theme.spacing(1),
  },
  timeStartEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    fontWeight: '300',
    flexWrap: 'wrap',
    color: theme.palette.primary.dark,
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end',
    },
  },
  timeStartEndBox: {
    width: '100%',
    padding: theme.spacing(.25),
    textAlign: 'right',
  },
  timeLogCounter: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: '#ffffff',
    lineHeight: '1',
    borderRadius: theme.spacing(0.5),
  },
  panelSummary: {
    padding: 0,
  },
  btnOverlay: {
    backgroundColor: 'rgba(0,0,0,.06)',
  },
  btnDelete: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
    },
  },
}));

function ExpansionComp({
  task,
  loading,
  projects,
  restartTaskCall,
  deleteGroupTaskCall,
  currentDate,
  modifyTaskNameCall,
  modifyTaskProjectNameCall,
}) {
  const classes = useStyles();
  const [project, setProject] = React.useState(task.projectName);
  const [taskName, setTaskName] = React.useState(task.taskName);

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    getProjects();
  }, []);
  const handleChange = event => {
    setProject(event.target.value);
    modifyTaskProjectNameCall(
      project,
      event.target.value,
      currentDate,
      false,
      task.startTime,
    );
  };
  const inputRef = React.useRef();

  const projectListProps = {
    loading,
    projects,
    project,
    handleChange,
  };
  return (
    <ExpansionPanelSummary
      className={classes.panelSummary}
      aria-label="Expand"
      aria-controls="additional-actions-content"
      id="additional-actions1-header"
    >
      <Paper className={classes.timeRecorder} elevation={0} square>
        <Box className={classes.timeRecorderBox}>
          <div className={classes.timeLogCounter}>{task.timer.length}</div>
        </Box>
        <Box
          flexGrow="1"
          className={[classes.timeRecorderBox, classes.taskNameBox]}
        >
          <TextField
            inputRef={inputRef}
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            id="standard-basic"
            label="enter your task"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            fullWidth
            onBlur={event => {
              if (event.target.value !== task.taskName) {
                console.log(event.target.value);
                modifyTaskNameCall(
                  task.taskName,
                  event.target.value,
                  currentDate,
                  false,
                  task.startTime,
                );
              }
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                inputRef.current.blur();
              }
            }}
          />
        </Box>
        <Box className={[classes.timeRecorderBox, classes.projectBox]}>
          <ProjectsList {...projectListProps} />
        </Box>
        <Box className={[classes.timeRecorderBox, classes.startEndBox]}>
          <div className={classes.timeStartEnd}>
            <div className={classes.timeStartEndBox}>
              <AccessTimeIcon fontSize="small" /> {formatTime(task.startTime)}
            </div>
            <div className={classes.timeStartEndBox}>
              <AccessTimeIcon fontSize="small" /> {formatTime(task.endTime)}
            </div>
          </div>
        </Box>
        <Box className={classes.timeRecorderBox}>
          <div className={classes.timeSpinner}>
            <div className={classes.timeSpinnerBox}>
              {msConversion(task.duration)}
            </div>
          </div>
        </Box>
        <Box className={classes.timeRecorderBox}>
          <div className={classes.timeRecorderActions}>
            <IconButton
              className={classes.btnOverlay}
              aria-label="play"
              onClick={() => {
                restartTaskCall(task.taskName, project);
              }}
            >
              <PlayArrowIcon fontSize="small" color="secondary" />
            </IconButton>

            <IconButton
              className={classes.btnDelete}
              aria-label="delete"
              onClick={() => {
                console.log(currentDate);
                deleteGroupTaskCall(task.taskName, currentDate);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </Box>
      </Paper>
    </ExpansionPanelSummary>
  );
}

ExpansionComp.propTypes = {
  task: PropTypes.any,
  loading: PropTypes.bool,
  projects: PropTypes.array,
  restartTaskCall: PropTypes.func,
  deleteGroupTaskCall: PropTypes.func,
  currentDate: PropTypes.string,
  modifyTaskNameCall: PropTypes.func,
  modifyTaskProjectNameCall: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProjects: () => dispatch(loadProjects()),

    restartTaskCall: (taskName, project) =>
      dispatch(restartTask({ taskName, project })),

    deleteGroupTaskCall: (taskName, date) =>
      dispatch(deleteGroupTask({ taskName, date })),
    modifyTaskNameCall: (
      taskName,
      newTaskName,
      currentDate,
      isPartOfGroup,
      startTime,
    ) =>
      dispatch(
        modifyTaskName({
          taskName,
          newTaskName,
          currentDate,
          isPartOfGroup,
          startTime,
        }),
      ),

    modifyTaskProjectNameCall: (
      projectName,
      newProjectName,
      currentDate,
      isPartOfGroup,
      startTime,
    ) =>
      dispatch(
        modifyTaskProjectName({
          projectName,
          newProjectName,
          currentDate,
          isPartOfGroup,
          startTime,
        }),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ExpansionComp);
