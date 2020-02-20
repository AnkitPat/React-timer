import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  timeRecorderBox: {
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2),
    },
  },
  btnOverlay: {
    backgroundColor: 'rgba(0,0,0,.06)',
  },
  timeSpinner: {
    color: theme.palette.primary.dark,
    [theme.breakpoints.up('lg')]: {
      fontSize: '24px',
    },
  },
  btnDelete: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
    },
  },
}));
