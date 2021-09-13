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
  breadcrumbs: {
    marginBottom: '25px',
  },
  input: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  filter: {
    top: '-4px',
  },
  create: {
    top: '-2px',
    height: '50%',
  },
  heading: {
    width: '100%',
    color: '#54c25a',
  },
  blueText: {
    color: '#2277ca',
  },
}));
