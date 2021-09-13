import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  breadcrumbs: {
    marginBottom: '25px',
  },
  root: {
    width: '100%',
  },
  actions: {
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  buttons: {
    '& .MuiButton-label': {
      padding: '2px 4px',
    },
  },
  textCenter: {
    textAlign: 'center',
  },
  greenText: {
    '& svg': {
      color: '#54c25a !important',
    }
  },
}));
