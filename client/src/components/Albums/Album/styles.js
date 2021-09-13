import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  border: {
    border: 'solid',
  },
  selected: {
    border: '3px solid red',
  },
  fullHeightCard: {
    height: '100%',
  },
  wip: {
    position: 'absolute',
    zIndex: 10000,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '6px',
    right: '50px',
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
    marginTop: '-16px',
    padding: '0 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
  },
  createdBy: {
    padding: '2rem 0 8px',
  },
  badge: {
    position: 'absolute',
    right: '0.85rem',
    top: '13.2rem',
  },
  gray: {
    color: 'gray'
  }
});
