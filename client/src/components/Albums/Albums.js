import React, { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';

import Album from './Album/Album';
import useStyles from './styles';
import { getAlbums, getPublicAlbums } from '../../redux/actions/albums';
import { SET_ALBUM_FILTER } from '../../redux/constants/actionTypes';
import AlbumForm from './AlbumForm/AlbumForm';
import { Transition } from '../shared/Transition';

// Render albums on homepage
const Albums = () => {
  const { albums, WIP, error } = useSelector((state) => state.albums);
  const { mine, filter }       = useSelector((state) => state.filter);
  const canCreateAlbum         = albums.length < 10;
  const regex                  = new RegExp(filter === '' ? '.*' : `.*${filter}.*`, 'i');
  const filteredAlbums         = albums.filter((g) => regex.test(g.title));
  // State of Edit popup
  const [openE, setOpenE]      = useState(false);
  const dispatch               = useDispatch();
  const classes                = useStyles();

  // Open/close Edit popup
  const openEdit  = useCallback(() => setOpenE(true), []);
  const closeEdit = useCallback(() => setOpenE(false), []);

  // Render form to create album
  const editForm = (
    <Dialog
      open={openE}
      onClose={closeEdit}
      TransitionComponent={Transition}
    >
      <AlbumForm album={null} handleClose={closeEdit} />
    </Dialog>
  );

  // Set filter value
  const handleFilterChange = (event) => dispatch({
    type: SET_ALBUM_FILTER,
    payload: event.target.value,
  });

  // Load private or public albums
  useEffect(() => {
    if (mine) {
      // Fetch albums of the user
      dispatch(getAlbums());
    } else {
      // Fetch albums of other users
      dispatch(getPublicAlbums());
    }
  }, [mine, dispatch]);

  // Breadcrumbs and filter field
  const breadcrumbs = (
    <div className={classes.input}>
      <Breadcrumbs separator="›" className={classes.breadcrumbs}>
        <Typography color="textPrimary">{mine ? 'My Albums' : 'Public Albums'}</Typography>
      </Breadcrumbs>
      {mine && canCreateAlbum && <Button variant="contained" color="primary" className={classes.create} onClick={openEdit}>Create Album</Button>}
      {mine && !canCreateAlbum && <Button variant="contained" size="small" disabled className={classes.create}>Create Album</Button>}
      {mine && canCreateAlbum && editForm}
      <TextField
        className={classes.filter}
        placeholder={mine ? 'Filter my albums' : 'Filter public albums'}
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );

  // Render albums
  const renderAlbums = (
    <Grid container alignItems="stretch" spacing={3}>
      {WIP && <CircularProgress className={classes.wip} />}
      <Typography component="h2" to="/" className={classes.heading} variant="h5" align="left">
        {mine && <span>You have used <span className={classes.blueText}>{filteredAlbums.length}</span> out of 10 albums </span>}
        {!mine && <span>There are <span className={classes.blueText}>{filteredAlbums.length}</span>  albums out of <span className={classes.blueText}>{albums.length}</span> </span>}
      </Typography>
      {!WIP && albums.length === 0 && (
        <Typography component="h3" to="/" variant="h3" align="center">
          {mine ? '' : 'There are no public albums yet...'}
        </Typography>
      )}
      {filteredAlbums.length > 0 && filteredAlbums.map((album) => (
        <Grid key={`g-${album.id}`} item xs={12} sm={12} md={4}>
          <Album album={album} mine={mine} />
        </Grid>
      ))}
    </Grid>
  );

  if (error) {
    return <Alert variant="filled" severity="error">{error}</Alert>;
  }

  return (
    <>
      {breadcrumbs}
      {renderAlbums}
    </>
  );
};

Albums.propTypes = {};

export default Albums;
