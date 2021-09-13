import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  index: {
    '& .image-gallery-image': {
      background: 'rgba(0, 0, 0, 1)',
    },
    '& .image-gallery-index': {
      right: 'initial',
      left: 0,
    },
    '& .image-gallery-description': {
      display: 'block',
      bottom: '40px',
      textAlign: 'center',
      padding: '3px 0',
      margin: 0,
      width: '100%',
      fontWeight: 'bold',
    },
  }
}));
