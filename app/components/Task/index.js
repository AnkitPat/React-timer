/**
 *
 * Task
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
import { makeStyles } from '@material-ui/core/styles';
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
import { formatTime, msConversion, translateLanguage } from '../../utils';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

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
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end',
    },
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
  timeLogPanel: {
    position: 'relative',
  },
}));

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

  const classes = useStyles();
  const inputRef = React.useRef();

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
              console.log(event.target.value);
              modifyTaskNameCall(
                task.taskName,
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
            {formatTime(task.startTime)}
          </div>
          <span className={classes.divider}>-</span>
          <div className={classes.timeStartEndBox}>
            {formatTime(task.endTime)}
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
              deleteSingleTaskCall(
                task.taskName,
                project,
                task.startTime,
                currentDate,
              );
            }}
          >
            <DeleteIcon color="" />
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

    deleteSingleTaskCall: (taskName, projectName, startTime, currentDate) =>
      dispatch(
        deleteSingleTask({ taskName, projectName, currentDate, startTime }),
      ),

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
)(Task);
