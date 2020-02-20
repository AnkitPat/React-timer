/**
 *
 * Task component to show info of single task
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import TimerIcon from '@material-ui/icons/Timer';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { injectIntl } from 'react-intl';
import ProjectsList from '../ProjectsList';
import { makeSelectProjects } from '../../containers/Dashboard/selectors';
import {
  loadProjects,
  restartTask,
  deleteSingleTask,
  modifyTaskName,
  modifyTaskProjectName,
} from '../../containers/Dashboard/actions';
import saga from '../../containers/Dashboard/saga';
import { formatTime, translateLanguage } from '../../utils';
import { useStyles } from './index.styles';

function Task({
  task,
  projects,
  getProjects,
  loading,
  restartTaskCall,
  deleteSingleTaskCall,
  currentDate,
  modifyTaskNameCall,
  isPartOfGroup,
  modifyTaskProjectNameCall,
  intl,
}) {
  useInjectSaga({ key: 'dashboard', saga });

  const classes = useStyles(isPartOfGroup);
  const inputRef = React.useRef();
  const [project, setProject] = React.useState(task.projectName);
  const [taskName, setTaskName] = React.useState(task.taskName);

  useEffect(() => {
    getProjects();
  }, []);

  const handleChange = event => {
    setProject(event.target.value);
    modifyTaskProjectNameCall(
      task.id,
      event.target.value,
      currentDate,
      isPartOfGroup,
      task.startTime,
    );
  };

  const projectListProps = {
    loading,
    projects,
    project,
    handleChange,
  };

  return (
    <Paper className={classes.timeRecorder} elevation={0} square>
      <Box
        flexGrow="1"
        className={[classes.timeRecorderBox, classes.taskNameBox]}
      >
        <TextField
          inputRef={inputRef}
          id="standard-basic"
          label={translateLanguage(intl, 'dashboard.taskPlaceholder')}
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          fullWidth
          onBlur={event => {
            if (event.target.value !== task.taskName) {
              modifyTaskNameCall(
                task.id,
                event.target.value,
                currentDate,
                isPartOfGroup,
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
            <TimerIcon fontSize="small" /> {formatTime(task.startTime)}
          </div>
          <div className={classes.timeStartEndBox}>
            <TimerOffIcon fontSize="small" /> {formatTime(task.endTime)}
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
              deleteSingleTaskCall(
                task.id,
                taskName,
                task.startTime,
                currentDate,
              );
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </Box>
    </Paper>
  );
}

Task.propTypes = {
  task: PropTypes.any,
  projects: PropTypes.array,
  getProjects: PropTypes.func,
  loading: PropTypes.bool,
  restartTaskCall: PropTypes.func,
  deleteSingleTaskCall: PropTypes.func,
  currentDate: PropTypes.string,
  modifyTaskNameCall: PropTypes.func,
  isPartOfGroup: PropTypes.bool,
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

    deleteSingleTaskCall: (taskId, taskName, startTime, currentDate) =>
      dispatch(deleteSingleTask({ taskId, taskName, currentDate, startTime })),

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
)(Task);
