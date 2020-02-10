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
import { makeSelectLoading, makeSelectProjects } from './selectors';
import reducer from './reducer';
import saga from './saga';
import TaskTimer from '../../components/TaskTimer';
import { loadProjects } from './actions';
import ProjectsList from '../../components/ProjectsList';

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
}));

export function Dashboard({ projects, getProjects, loading }) {
  useInjectReducer({ key: 'dashboard', reducer });
  useInjectSaga({ key: 'dashboard', saga });
  const classes = useStyles();

  const [project, setProject] = React.useState('');
  const [taskName, setTaskName] = React.useState('');
  const [timerStatus, setTimerStatus] = React.useState(true);

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    getProjects();
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
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>
      <Paper className={classes.timeRecorder} elevation={1} square>
        <Box flexGrow="1" className={classes.timeRecorderBox}>
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
        <Box className={classes.timeRecorderBox}>
          <ProjectsList {...projectListProps} />
        </Box>
        <TaskTimer {...timerProps} />
      </Paper>
    </div>
  );
}

Dashboard.propTypes = {
  projects: PropTypes.array,
  getProjects: PropTypes.func,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProjects: () => dispatch(loadProjects()),
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
