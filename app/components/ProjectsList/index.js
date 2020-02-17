import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import LoadingIndicator from '../LoadingIndicator';

const useStyles = makeStyles(() => ({
  selectProject: {
    minWidth: '120px',
  },
}));

function ProjectsList({ loading, projects, handleChange, project }) {
  const classes = useStyles();
  if (loading) {
    return <LoadingIndicator />;
  }
  console.log(loading, projects, handleChange, project);
  if (projects.length !== 0) {
    return (
      <TextField
        id="demo-simple-select"
        label="Project"
        select
        onChange={handleChange}
        value={project}
        className={classes.selectProject}
      >
        {projects.map(item => (
          <MenuItem value={item.name} key={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return null;
}

ProjectsList.propTypes = {
  loading: PropTypes.bool,
  projects: PropTypes.array,
  project: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func,
};

export default ProjectsList;
