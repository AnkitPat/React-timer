/**
 *
 * Expansion Component with total time of sub-tasks and count of it
 *
 */

import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import { injectIntl } from 'react-intl';
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
import { formatTime, translateLanguage } from '../../utils';
import { useStyles } from './index.styles';

function ExpansionComp({
  task,
  loading,
  projects,
  restartTaskCall,
  deleteGroupTaskCall,
  currentDate,
  modifyTaskNameCall,
  modifyTaskProjectNameCall,
  intl,
}) {
  const inputRef = React.useRef();
  const classes = useStyles();
  const [project, setProject] = React.useState(task.projectName);
  const [taskName, setTaskName] = React.useState(task.taskName);
  const projectListProps = {
    loading,
    projects,
    project,
    handleChange,
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleChange = event => {
    setProject(event.target.value);
    modifyTaskProjectNameCall(
      task.id,
      event.target.value,
      currentDate,
      false,
      task.startTime,
    );
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
            label={translateLanguage(intl, 'dashboard.taskPlaceholder')}
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            fullWidth
            onBlur={event => {
              if (event.target.value !== task.taskName) {
                console.log(event.target.value);
                modifyTaskNameCall(
                  task.id,
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
            <div className={classes.timeSpinnerBox}>{task.duration}</div>
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
                deleteGroupTaskCall(task.id, currentDate);
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
  intl: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
});

const mapDispatchToProps = dispatch => ({
  getProjects: () => dispatch(loadProjects()),

  restartTaskCall: (taskName, project) =>
    dispatch(restartTask({ taskName, project })),

  deleteGroupTaskCall: (taskId, date) =>
    dispatch(deleteGroupTask({ taskId, date })),

  modifyTaskNameCall: (
    taskId,
    newTaskName,
    currentDate,
    isPartOfGroup,
    startTime,
  ) =>
    dispatch(
      modifyTaskName({
        taskId,
        newTaskName,
        currentDate,
        isPartOfGroup,
        startTime,
      }),
    ),

  modifyTaskProjectNameCall: (
    taskId,
    newProjectName,
    currentDate,
    isPartOfGroup,
    startTime,
  ) =>
    dispatch(
      modifyTaskProjectName({
        taskId,
        newProjectName,
        currentDate,
        isPartOfGroup,
        startTime,
      }),
    ),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(ExpansionComp);
