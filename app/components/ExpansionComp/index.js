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
import { injectIntl } from 'react-intl';
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

const useStyles = makeStyles(theme => ({
  timeRecorder: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  timeRecorderBox: {
    padding: theme.spacing(2),
  },
  selectProject: {
    minWidth: '120px',
  },
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
  timeLogCounter: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: '#ffffff',
    lineHeight: '1',
    borderRadius: theme.spacing(0.5),
  },
  timeLog: {
    marginTop: theme.spacing(4),
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
  timeLogPanelBody: {
    display: 'none',
  },
  panelSummary: {
    padding: 0,
  },
  panelDetails: {
    padding: 0,
    flexWrap: 'wrap',
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
  intl,
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
      aria-controls="additional-actions1-content"
      id="additional-actions1-header"
    >
      <Paper className={classes.timeRecorder} elevation={0} square>
        <Box className={classes.timeRecorderBox}>
          <div className={classes.timeLogCounter}>{task.timer.length}</div>
        </Box>
        <Box flexGrow="1" className={classes.timeRecorderBox}>
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
        <Box className={classes.timeRecorderBox}>
          <ProjectsList {...projectListProps} />
        </Box>
        <Box className={classes.timeRecorderBox}>
          <div className={classes.timeStartEnd}>
            <div className={classes.timeStartEndBox}>
              {formatTime(task.startTime)}
            </div>{' '}
            -
            <div className={classes.timeStartEndBox}>
              {formatTime(task.endTime)}
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
              aria-label="play"
              onClick={() => {
                restartTaskCall(task.taskName, project);
              }}
            >
              <PlayArrowIcon color="primary" />
            </IconButton>

            <IconButton
              aria-label="delete"
              onClick={() => {
                console.log(currentDate);
                deleteGroupTaskCall(task.taskName, project, currentDate);
              }}
            >
              <DeleteIcon color="" />
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

function mapDispatchToProps(dispatch) {
  return {
    getProjects: () => dispatch(loadProjects()),

    restartTaskCall: (taskName, project) =>
      dispatch(restartTask({ taskName, project })),

    deleteGroupTaskCall: (taskName, projectName, date) =>
      dispatch(deleteGroupTask({ taskName, projectName, date })),
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
  injectIntl,
)(ExpansionComp);
