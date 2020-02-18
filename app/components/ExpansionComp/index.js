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
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';

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
  selectProject: {
    minWidth: '120px',
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
  panelSummary: {
    padding: 0,
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
        <Box flexGrow="1" className={[classes.timeRecorderBox, classes.taskNameBox]}>
          <TextField
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            id="standard-basic"
            label="enter your task1"
            value={task.taskName}
            fullWidth
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
          <IconButton aria-label="play">
            <PlayArrowIcon color="primary" />
          </IconButton>
          <IconButton aria-label="stop">
            <StopIcon color="secondary" />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon color="" />
          </IconButton>
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
