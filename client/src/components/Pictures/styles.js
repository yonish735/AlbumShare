import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  smMargin: {
    margin: theme.spacing(1),
  },
  actionDiv: {
    textAlign: 'center',
  },
  wip: {
    position: 'absolute',
    zIndex: 10000,
  },
  heading: {
    width: '100%',
    color: '#54c25a',
    margin: '0 12px',
  },
  blueText: {
    color: '#2277ca',
  },
  paddingLeft: {
    paddingLeft: '5px',
  },
  input: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    cursor: 'pointer',
  },
  create: {
    top: '-2px',
    height: '50%',
  },
  breadcrumbs: {
    marginBottom: '10px',
  },
  albumPopup: {
    '& .MuiDialog-paper': {
      background: 'rgba(0, 0, 0, 1)',
    }
  },
  appBar: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    paddingRight: '0 !important',
  },
  toolBar: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    margin: 0,
    padding: 0,
    color: 'white',
  },
}));
