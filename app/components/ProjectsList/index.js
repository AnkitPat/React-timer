import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import LoadingIndicator from '../LoadingIndicator';
import { translateLanguage } from '../../utils';

const useStyles = makeStyles(() => ({
  selectProject: {
    width: '100%',
  },
}));

const ProjectsList = ({ loading, projects, handleChange, project, intl }) => {
  const classes = useStyles();
  if (loading) {
    return <LoadingIndicator />;
  }
  if (projects.length !== 0) {
    return (
      <TextField
        id="demo-simple-select"
        label={translateLanguage(intl, 'dashboard.projectPlaceholder')}
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
};

ProjectsList.propTypes = {
  loading: PropTypes.bool,
  projects: PropTypes.array,
  project: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func,
  intl: PropTypes.any,
};

export default injectIntl(ProjectsList);
