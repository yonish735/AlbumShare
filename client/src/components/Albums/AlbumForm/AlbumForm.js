import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { createAlbum, updateAlbum } from '../../../redux/actions/albums';
import useStyles from './styles';
import { CREATE_ALBUM_CLEAR } from '../../../redux/constants/actionTypes';
import { FormControlLabel, Switch } from '@material-ui/core';
import FileBase from '../../FileBase/FileBase';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { albumShape } from '../../shared/shapes';

const initialState = { title: '', description: '', private: true, image: '' };

// Render Album Form
const AlbumForm = ({ album, handleClose }) => {
  const [albumData, setAlbumData] = useState(initialState);
  const [fileName, setFileName]   = useState('');

  const userId                   = useSelector((state) => state.auth?.user?.id);
  const { created, createError } = useSelector((state) => state.albums);
  const dispatch                 = useDispatch();
  const classes                  = useStyles();

  useEffect(() => {
    if (album) {
      // Edit Album: load it into form
      setAlbumData(album);
      setFileName(album.filename || '');
    } else {
      // Create Album: load empty values into form
      setAlbumData(initialState);
      setFileName('');
    }
  }, [album]);

  useEffect(() => {
    if (created) {
      setAlbumData(initialState);
      dispatch({ type: CREATE_ALBUM_CLEAR });
      handleClose();
    }
  }, [created, dispatch, handleClose]);

  const handleSubmit = (e) => {
    // Stop bubbling the event
    e.preventDefault();
    if (albumData.title === '' || albumData.image === '') {
      return;
    }
    if (album) {
      // Update album
      dispatch(updateAlbum(album.id, albumData, fileName));
    } else {
      // Create album
      albumData['user_id'] = userId;
      dispatch(createAlbum(albumData, fileName));
    }
  };

  const setPrivate = (e) => setAlbumData({ ...albumData, private: e.target.checked });

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{album ? `Edit Album` : 'Create a new Album'}</Typography>
        <TextField name="title" variant="outlined" label="Title *" fullWidth value={albumData.title}
                   onChange={(e) => setAlbumData({
                     ...albumData,
                     title: e.target.value.slice(0, 18)
                   })}
        />
        <TextField name="description" variant="outlined" label="Description" fullWidth multiline rows={4} value={albumData.description} onChange={(e) => setAlbumData({
          ...albumData,
          description: e.target.value
        })} />
        <FormControlLabel
          className={classes.switch}
          control={<Switch name="private" variant="outlined" checked={albumData.private} onChange={setPrivate} />}
          label="Private"
        />
        <FileBase onDone={({ base64 }) =>

          setAlbumData({
          ...albumData,
          image: base64
        })} fileName={fileName} setFileName={setFileName} />
        {createError && <Alert variant="filled" severity="error" className={classes.alert}>{createError}</Alert>}
        <Button className={classes.buttonSubmit} disabled={albumData.title === '' || albumData.image === ''} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={handleClose} fullWidth>Cancel</Button>
      </form>
    </Paper>
  );
};

AlbumForm.propTypes = {
  album: albumShape,
  handleClose: PropTypes.func.isRequired,
};

export default AlbumForm;
