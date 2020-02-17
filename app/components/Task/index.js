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
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import ProjectsList from '../ProjectsList';
import { makeSelectProjects } from '../../containers/Dashboard/selectors';
import { loadProjects } from '../../containers/Dashboard/actions';
import saga from '../../containers/Dashboard/saga';
import { formatTime, msConversion } from '../../utils';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

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
  timeLogPanel: {
    position: 'relative',
  },
}));

function Task({ task, projects, getProjects, loading }) {
  useInjectSaga({ key: 'dashboard', saga });
  const [project, setProject] = React.useState(task.projectName);

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    getProjects();
  }, []);
  const handleChange = event => {
    setProject(event.target.value);
  };

  const projectListProps = {
    loading,
    projects,
    project,
    handleChange,
  };

  const classes = useStyles();

  console.log('TASK COMP ----->props: ', task);
  return (
    <Paper className={classes.timeRecorder} elevation={0} square>
      <Box flexGrow="1" className={classes.timeRecorderBox}>
        <TextField
          id="standard-basic"
          label="Enter your task"
          value={task.taskName}
          fullWidth
        />
      </Box>
      <Box className={classes.timeRecorderBox}>
        <ProjectsList {...projectListProps} />
      </Box>
      <Box className={classes.timeRecorderBox}>
        <div className={classes.timeStartEnd}>
          <div className={classes.timeStartEndBox}>
            {formatTime(task.startTime)}
          </div>
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
          <IconButton aria-label="play">
            <PlayArrowIcon color="primary" />
          </IconButton>
          <IconButton aria-label="stop">
            <StopIcon color="secondary" />
          </IconButton>
          <IconButton aria-label="delete">
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
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
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
)(Task);
