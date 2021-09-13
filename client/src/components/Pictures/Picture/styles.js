import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  border: {
    border: 'solid',
  },
  overlay: {
    position: 'absolute',
    top: '2px',
    right: '8px',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
  },
  title: {
    padding: '0 16px',
    color: 'black',
    textAlign: 'left',
    margin: 0,
  },
  nohover: {
    textDecoration: 'none !important',
  },
  description: {
    height: '5rem',
    overflow: 'auto',
    lineHeight: 1.15,
    fontSize: '1.4rem',
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
  },
}));
