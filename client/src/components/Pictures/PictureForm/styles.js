import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root, & .MuiFormControlLabel-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  buttonClear: {
    background: 'gray',
  },
  alert: {
    width: '100%',
    marginBottom: 10,
  },
}));
