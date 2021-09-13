import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
  fileInput: {
    display: 'none',
  },
  fileName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '23ch',
    display: 'inline-block',
    position: 'relative',
    top: '8px',
  },
  alert: {
    width: '100%',
  },
}));
