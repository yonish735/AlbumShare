import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    position: 'relative',
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  resubmit: {
    margin: theme.spacing(0, 0, 2),
  },
  googleButton: {
    marginBottom: theme.spacing(2),
  },
  error: {
    ...theme.typography.button,
    color: theme.palette.error.dark,
    padding: theme.spacing(2, 1, 0),
    textTransform: 'none',
  },
  column: {
    flexDirection: 'column',
    textAlign: 'right',
  },
  albumAlbum: {
    color: '#54c25a',
    fontWeight: 900,
  },
  blueText: {
    color: '#2277ca',
  },
  title: {
    textDecoration: 'none',
  },
  image: {
    marginRight: '15px',
  },
  forgotPassword: {
    marginRight: theme.spacing(26),
    color: '#2277ca',
  },
}));
