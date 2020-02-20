import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
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
