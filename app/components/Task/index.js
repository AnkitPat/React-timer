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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
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
import { formatTime, translateLanguage } from '../../utils';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  timeRecorder: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    background: 'transparent',
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
    },
    '&:not(:first-child)': {
      borderTop: '1px solid #eaeaea',
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
    padding: theme.spacing(0.5),
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
    padding: theme.spacing(0.25),
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
  timeLog: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
  timeLogPanel: {
    position: 'relative',
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
