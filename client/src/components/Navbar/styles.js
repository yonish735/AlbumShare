import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  headerOuter: {
    borderRadius: 15,
    margin: '0 0 30px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
  },
  title: {
    color: 'rgba(0, 183, 255, 1)',
    textDecoration: 'none',
  },
  image: {
    marginRight: '15px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    textTransform: 'uppercase',
    fontWeight: 500,
    marginRight: theme.spacing(2),
  },
  mail: {
    fontSize: '2.5rem',
  },
  logout: {
    marginLeft: theme.spacing(2),
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  albumAlbum: {
    color: '#54c25a',
    fontWeight: 900,
  },
  blueColor: {
    color: '#2277ca',
  },
  greenColor: {
    color: '#54c25a',
  },
  switch: {
    marginLeft: '0',
    marginRight: '16px',
  },
}));
