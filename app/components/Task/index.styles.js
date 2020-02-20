import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  timeRecorder: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    background: 'transparent',
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
    },
    '&:not(:first-child)': {
      borderTop: '1px solid #eaeaea',
    },
    [theme.breakpoints.up('lg')]: {
      padding: `0 ${theme.spacing(1)}px`,
    },
  },
  timeRecorderBox: {
    padding: theme.spacing(1),
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
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(0.5),
    borderRadius: '4px',
    fontSize: '12px',
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
    fontSize: '12px',
    fontWeight: '300',
    flexWrap: 'wrap',
    color: theme.palette.primary.dark,
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end',
    },
  },
  timeStartEndBox: {
    width: '100%',
    padding: theme.spacing(0.25),
    textAlign: 'right',
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
  timeLogPanel: {
    position: 'relative',
  },
  btnOverlay: {
    backgroundColor: 'rgba(0,0,0,.06)',
  },
  btnDelete: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
    },
  },
}));
