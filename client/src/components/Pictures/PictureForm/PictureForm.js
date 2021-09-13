import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import FileBase from '../../FileBase/FileBase';
import { createPicture, updatePicture } from '../../../redux/actions/pictures';
import { CREATE_PICTURE_CLEAR } from '../../../redux/constants/actionTypes';
import { Alert } from '@material-ui/lab';
import { pictureShape } from '../../shared/shapes';

const initialState = { title: '', description: '', image: '' };

// Render Picture Form
const PictureForm = ({ picture, albumId, handleClose }) => {
  const [pictureData, setPictureData] = useState(initialState);
  const [fileName, setFileName]       = useState('');
  const { created, createError }      = useSelector((state) => state.pictures);
  const { mine }                      = useSelector((state) => state.filter);

  const dispatch = useDispatch();
  const classes  = useStyles();

  useEffect(() => {
    if (picture) {
      // Edit Picture: load it into form
      setPictureData(picture);
      setFileName(picture.filename || '');
    } else {
      // Create Picture: load empty values into form
      setPictureData(initialState);
      setFileName('');
    }
  }, [picture]);

  useEffect(() => {
    if (created) {
      setPictureData(initialState);
      dispatch({ type: CREATE_PICTURE_CLEAR });
      handleClose();
    }
  }, [created, dispatch, handleClose]);

  const handleSubmit = async (e) => {
    // Stop bubbling the even
    e.preventDefault();
    if (pictureData.title === '' || pictureData.image === '') {
      return;
    }
    if (picture) {
      // Update picture
      dispatch(updatePicture(picture.id, pictureData, fileName));
    } else {
      // Create picture
      pictureData['album_id'] = albumId;
      dispatch(createPicture(pictureData, fileName));
    }
  };

  if (!mine) {
    return null;
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{picture ? `Edit Picture` : 'Upload a new Picture'}</Typography>
        <TextField name="title" variant="outlined" label="Title *" fullWidth value={pictureData.title} onChange={(e) => setPictureData({ ...pictureData, title: e.target.value.slice(0, 18) })} />
        <TextField name="description" variant="outlined" label="Description" fullWidth multiline rows={4} value={pictureData.description} onChange={(e) => setPictureData({
          ...pictureData,
          description: e.target.value
        })} />
        <FileBase onDone={({ base64 }) => setPictureData({ ...pictureData, image: base64 })} fileName={fileName} setFileName={setFileName} />
        {createError && <Alert variant="filled" severity="error" className={classes.alert}>{createError}</Alert>}
        <Button className={classes.buttonSubmit} disabled={pictureData.title === '' || pictureData.image === ''} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button className={classes.buttonClear} variant="contained" color="secondary" size="small" onClick={handleClose} fullWidth>Cancel</Button>
      </form>
    </Paper>
  );
};

PictureForm.propTypes = {
  picture: pictureShape,
  albumId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PictureForm;
