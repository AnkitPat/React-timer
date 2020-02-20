import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  timeSpinner: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.dark,
    fontSize: '20px',
  },
  timeSpinnerBox: {
    padding: theme.spacing(1),
  },
  timeLogTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: theme.palette.primary.dark,
  },
  timeLogTotal: {
    display: 'flex',
    alignItems: 'center',
  },
  timeLogPanel: {
    position: 'relative',
  },
}));
