/**
 *
 * Dashboard
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty, has } from 'lodash';
import {
  makeSelectLoading,
  makeSelectProjects,
  makeSelectTasks,
  makeRestartTaskData,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import TaskTimer from '../../components/TaskTimer';
import { loadProjects, sortTask, restartTask } from './actions';
import ProjectsList from '../../components/ProjectsList';
import DateComp from '../../components/DateComp';
import TasksComponent from '../../components/TasksComponent';

const useStyles = makeStyles(theme => ({
  timeRecorder: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
    },
  },
  timeRecorderBox: {
    padding: theme.spacing(1),
    whiteSpace: 'nowrap',
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
  timeLog: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
}));

export function Dashboard({
  tasks,
  projects,
  getProjects,
  saveTask,
  loading,
  restartTaskData,
  restartTaskCall,
}) {
  useInjectReducer({ key: 'dashboard', reducer });
  useInjectSaga({ key: 'dashboard', saga });
  const classes = useStyles();

  const [project, setProject] = React.useState('');
  const [taskName, setTaskName] = React.useState('');
  const [timerStatus, setTimerStatus] = React.useState(true);
  const [startTimerClock, setStartTimerClock] = React.useState(false);

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    getProjects();

    if (
      !isEmpty(restartTaskData) &&
      has(restartTaskData, 'taskName') &&
      restartTaskData.taskName !== undefined
    ) {
      setTaskName(restartTaskData.taskName);
      setProject(restartTaskData.project);
      setStartTimerClock(true);
      restartTaskCall('', '');
    }
  });

  const handleChange = event => {
    setProject(event.target.value);
  };

  const startTimer = event => {
    if (event !== undefined && event.preventDefault) event.preventDefault();
    setTimerStatus(false);
  };

  const onChangeTaskName = event => {
    setTaskName(event.target.value);
  };

  const deleteTask = () => {
    setTaskName('');
    setProject('');
    setTimerStatus(true);
    setStartTimerClock(false);
  };

  const stopTask = (start, end) => {
    setStartTimerClock(false);
    setTimerStatus(false);
    saveTask(taskName, project, start, end);
  };

  const projectListProps = {
    loading,
    projects,
    project,
    handleChange,
  };

  const timerProps = {
    timerStatus,
    deleteTask,
    stopTask,
  };
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>
      <Paper className={classes.timeRecorder} elevation={1} square>
        <Box
          flexGrow="1"
          className={[classes.timeRecorderBox, classes.taskNameBox]}
        >
          <form onSubmit={startTimer}>
            <TextField
              id="standard-basic"
              label="Enter your task"
              onChange={onChangeTaskName}
              value={taskName}
              fullWidth
            />
          </form>
        </Box>
        <Box className={[classes.timeRecorderBox, classes.projectBox]}>
          <ProjectsList {...projectListProps} />
        </Box>
        <TaskTimer {...timerProps} restart={startTimerClock} />
      </Paper>

      {Object.keys(tasks).map(d => (
        // let cDate = getDate(d);

        <div className={classes.timeLog}>
          <DateComp date={d} tasks={tasks[d]} key={d} />
          <TasksComponent taskList={tasks[d]} key={tasks[d]} />
        </div>
      ))}
    </div>
  );
}

Dashboard.propTypes = {
  projects: PropTypes.array,
  getProjects: PropTypes.func,
  saveTask: PropTypes.func,
  loading: PropTypes.bool,
  tasks: PropTypes.array,
  restartTaskCall: PropTypes.func,
  restartTaskData: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  loading: makeSelectLoading(),
  tasks: makeSelectTasks(),
  restartTaskData: makeRestartTaskData(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProjects: () => dispatch(loadProjects()),
    saveTask: (taskName, projectName, startTime, endTime) =>
      dispatch(sortTask({ taskName, projectName, startTime, endTime })),

    restartTaskCall: () =>
      dispatch(restartTask({ taskName: undefined, project: undefined })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Dashboard);
