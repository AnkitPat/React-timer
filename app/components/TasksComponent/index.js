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
  timeLog: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
  timeLogTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
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
    backgroundColor: theme.palette.background.default,
  },
}));

function TasksComponent(props) {
  const classes = useStyles();

  const display = [];

  if (props.taskList.length === 0) {
    console.log(display);
  }
  props.taskList.map(task => {
    if (task.timer.length > 1) {
      display.push(
        <ExpansionPanel key={task.startTime} className={classes.panel}>
          <ExpansionComp
            key={task.timer}
            task={task}
            currentDate={props.currentDate}
          />
          <ExpansionPanelDetails className={classes.panelDetails}>
            {task.timer.map(timer => (
              <Task
                key={task.taskName + task.projectName + timer.startTime}
                currentDate={props.currentDate}
                isPartOfGroup
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
    } else if (task.timer.length === 0) {
      console.log(display);
    } else {
      display.push(
        <ExpansionPanel key={task.startTime} className={classes.panel}>
          <ExpansionPanelDetails className={classes.panelDetails}>
            <Task
              task={task}
              currentDate={props.currentDate}
              isPartOfGroup={false}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>,
      );
    }

    return task;
  });

  return display.length > 0 ? (
    <div className={classes.timeLogPanel}>{display}</div>
  ) : (
    <div />
  );
}

TasksComponent.propTypes = {
  taskList: PropTypes.array,
  currentDate: PropTypes.string,
};

export default TasksComponent;
