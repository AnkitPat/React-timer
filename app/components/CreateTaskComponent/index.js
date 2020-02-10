/**
 *
 * CreateTaskComponent
 *
 */

import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import Timer from '../TaskTimer';

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

function CreateTaskComponent() {
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const handleChange = event => {
    setAge(event.target.value);
  };
  return (
    <div>
      <Paper className={classes.timeRecorder} elevation={1} square>
        <Box flexGrow="1" className={classes.timeRecorderBox}>
          <TextField id="standard-basic" label="Enter your task" fullWidth />
        </Box>
        <Box className={classes.timeRecorderBox}>
          <TextField
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Project"
            select
            onChange={handleChange}
            className={classes.selectProject}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </TextField>
        </Box>
        <Timer />
      </Paper>
    </div>
  );
}

CreateTaskComponent.propTypes = {};

export default CreateTaskComponent;
