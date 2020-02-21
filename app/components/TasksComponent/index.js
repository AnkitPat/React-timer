/**
 *
 * TasksComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Task from '../Task';
import ExpansionComp from '../ExpansionComponent';
import { useStyles } from './index.styles';

const TasksComponent = props => {
  const classes = useStyles();

  const display = [];

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
    <></>
  );
};

TasksComponent.propTypes = {
  taskList: PropTypes.array,
  currentDate: PropTypes.string,
};

export default TasksComponent;
