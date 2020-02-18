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
import { loadProjects } from '../../containers/Dashboard/actions';
import ProjectsList from '../ProjectsList';
import { makeSelectProjects } from '../../containers/Dashboard/selectors';
import { getProjects } from '../../containers/Dashboard/saga';
import { formatTime, msConversion } from '../../utils';

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

function ExpansionComp({ task, loading, projects }) {
  const classes = useStyles();
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
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            id="standard-basic"
            label="enter your task"
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
            </div>{' '}
            -
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
          {/* <div
            className={classes.timeRecorderActions}
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
          >
            <IconButton aria-label="play">
              <PlayArrowIcon color="primary" />
            </IconButton>
            <IconButton aria-label="stop">
              <StopIcon color="secondary" />
            </IconButton>
            <IconButton aria-label="delete">
              <DeleteIcon color="" />
            </IconButton>
          </div> */}
        </Box>
      </Paper>
    </ExpansionPanelSummary>
  );
}

ExpansionComp.propTypes = {
  task: PropTypes.any,
  loading: PropTypes.bool,
  projects: PropTypes.array,
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
)(ExpansionComp);
