import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  dialogAppBar: {
    position: 'relative',
  } ,
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogActions: {
    justifyContent: 'center',
  },
}));
