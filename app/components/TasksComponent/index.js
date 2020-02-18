/**
 *
 * TasksComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { makeStyles } from '@material-ui/core/styles';

import Task from '../Task';
import ExpansionComp from '../ExpansionComp';

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

function TasksComponent(props) {
  const classes = useStyles();

  const display = [];

  props.taskList.map(task => {
    if (task.timer.length > 1) {
      display.push(
        <ExpansionPanel key={task.startTime} className={classes.panel}>
          <ExpansionComp key={task.timer} task={task} />
          <ExpansionPanelDetails className={classes.panelDetails}>
            {task.timer.map(timer => (
              <Task
                task={{
                  ...task,
                  startTime: timer.startTime,
                  endTime: timer.endTime,
                  duration: timer.duration,
                }}
              />
            ))}
          </ExpansionPanelDetails>
        </ExpansionPanel>,
      );
    } else {
      display.push(
        <ExpansionPanel key={task.startTime} className={classes.panel}>
          <ExpansionPanelDetails className={classes.panelDetails}>
            <Task task={task} />
          </ExpansionPanelDetails>
        </ExpansionPanel>,
      );
    }

    return task;
  });

  return <div className={classes.timeLogPanel}>{display}</div>;
}

TasksComponent.propTypes = {
  taskList: PropTypes.array,
};

export default TasksComponent;
