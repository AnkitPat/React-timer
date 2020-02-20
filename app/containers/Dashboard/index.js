/**
 *
 * Dashboard Container
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { isEmpty, has } from 'lodash';
import { injectIntl } from 'react-intl';
import {
  makeSelectLoading,
  makeSelectProjects,
  makeSelectTasks,
  makeRestartTaskData,
} from './selectors';
import saga from './saga';
import TaskTimer from '../../components/TaskTimer';
import { loadProjects, sortTask, restartTask } from './actions';
import ProjectsList from '../../components/ProjectsList';
import DateComponent from '../../components/DateComponent';
import TasksComponent from '../../components/TasksComponent';
import { translateLanguage } from '../../utils';
import { useStyles } from './index.styles';

export const Dashboard = ({
  tasks,
  projects,
  getProjects,
  saveTask,
  loading,
  restartTaskData,
  restartTaskCall,
  intl,
}) => {
  useInjectSaga({ key: 'dashboard', saga });

  const classes = useStyles();
  const taskInputRef = React.useRef();
  const [project, setProject] = React.useState('');
  const [taskName, setTaskName] = React.useState('');
  const [timerStatus, setTimerStatus] = React.useState(true);
  const [startTimerClock, setStartTimerClock] = React.useState(false);

  useEffect(() => {
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
        <title>{translateLanguage(intl, 'dashboard.title')}</title>
        <meta
          name="description"
          content={translateLanguage(intl, 'dashboard.description')}
        />
      </Helmet>
      <Paper className={classes.timeRecorder} elevation={1} square>
        <Box
          flexGrow="1"
          className={[classes.timeRecorderBox, classes.taskNameBox]}
        >
          <form onSubmit={startTimer}>
            <TextField
              inputRef={taskInputRef}
              id="standard-basic"
              label={translateLanguage(intl, 'dashboard.taskPlaceholder')}
              onChange={onChangeTaskName}
              value={taskName}
              fullWidth
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  taskInputRef.current.blur();
                  if (!startTimerClock) {
                    setStartTimerClock(true);
                    startTimer();
                  }
                }
              }}
            />
          </form>
        </Box>
        <Box className={[classes.timeRecorderBox, classes.projectBox]}>
          <ProjectsList {...projectListProps} />
        </Box>
        <TaskTimer {...timerProps} restart={startTimerClock} />
      </Paper>

      {Object.keys(tasks)
        .reverse()
        .map(date => (
          <div className={classes.timeLog}>
            <DateComponent date={date} tasks={tasks[date]} key={date} />
            <TasksComponent
              taskList={tasks[date]}
              key={tasks[date]}
              currentDate={date}
            />
          </div>
        ))}
    </div>
  );
};

Dashboard.propTypes = {
  projects: PropTypes.array,
  getProjects: PropTypes.func,
  saveTask: PropTypes.func,
  loading: PropTypes.bool,
  tasks: PropTypes.any,
  restartTaskCall: PropTypes.func,
  restartTaskData: PropTypes.any,
  intl: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  loading: makeSelectLoading(),
  tasks: makeSelectTasks(),
  restartTaskData: makeRestartTaskData(),
});

const mapDispatchToProps = dispatch => ({
  getProjects: () => dispatch(loadProjects()),

  saveTask: (taskName, projectName, startTime, endTime) =>
    dispatch(sortTask({ taskName, projectName, startTime, endTime })),

  restartTaskCall: () =>
    dispatch(restartTask({ taskName: undefined, project: undefined })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(Dashboard);
