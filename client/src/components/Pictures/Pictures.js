import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import Picture from './Picture/Picture';
import PictureForm from './PictureForm/PictureForm';
import { albumShape } from '../shared/shapes';
import { Transition } from '../shared/Transition';
import Carousel from './Carousel/Carousel';
import useStyles from './styles';

// Render pictures on homepage
const Pictures = ({ album }) => {
  let { pictures, WIP, error } = useSelector((state) => state.pictures);
  const { mine }               = useSelector((state) => state.filter);
  const canCreatePicture       = pictures.length < 20;

  // State of Edit popup
  const [openE, setOpenE]         = useState(false);
  // State of a Pictures carousel
  const [openC, setOpenC]         = useState(false);
  const [pictureId, setPictureId] = useState(0);
  const history                   = useHistory();
  const classes                   = useStyles();

  // Open/close Edit popup
  const openEdit  = useCallback(() => setOpenE(true), []);
  const closeEdit = useCallback(() => setOpenE(false), []);

  // Open/close pictures carousel
  const openCarousel  = (pictureId) => {
    setPictureId(pictureId);
    setOpenC(true);
  };
  const closeCarousel = () => setOpenC(false);

  const day = dayjs(album.created_at).format('DD/MM/YYYY');

  // Render form to create picture
  const editForm = (
    <Dialog
      open={openE}
      onClose={closeEdit}
      TransitionComponent={Transition}
    >
      <PictureForm picture={null} albumId={album.id} handleClose={closeEdit} />
    </Dialog>
  );

  if (error) {
    return <Alert variant="filled" severity="error">{error}</Alert>;
  }

  // Breadcrumbs
  const breadcrumbs = (
    <div className={classes.input}>
      <Breadcrumbs separator="›" className={classes.breadcrumbs}>
        <Link className={classes.link} color="inherit" to="" onClick={() => history.push(`/`)}>{mine ? 'My Albums' : 'Public Albums'}</Link>
        <Typography color="textPrimary">{album.title}</Typography>
      </Breadcrumbs>
      {mine && canCreatePicture && <Button variant="contained" color="primary" size="small" className={classes.create} onClick={openEdit}>Upload Picture</Button>}
      {mine && !canCreatePicture && <Button variant="contained" disabled size="small" className={classes.create}>Upload Picture</Button>}
      {mine && canCreatePicture && editForm}
    </div>
  );

  const renderPictures = (
    <Grid container alignItems="stretch" spacing={3}>
      {WIP && <CircularProgress className={classes.wip} />}
      <Typography component="h2" to="/" className={classes.heading} variant="h5" align="left">
        <Grid container spasing={10}>
          <Grid item xs={4}>Created on: {day}</Grid>
          {!mine && <Grid item xs={4} className={classes.paddingLeft}>Owner: {album.user?.first_name} {album.user?.last_name}</Grid>}
          <Grid item xs={4} className={classes.paddingLeft}><span className={classes.blueText}>{pictures.length}/20</span> pictures</Grid>
        </Grid>
      </Typography>
      {pictures.length > 0 && pictures.map((picture) => (
        <Grid key={`p-${picture.id}`} item xs={12} sm={12} md={4}>
          <Picture picture={picture} mine={mine} openCarousel={openCarousel} />
        </Grid>
      ))}
    </Grid>
  );

  const renderAlbumPopup = (
    <Dialog
      fullScreen
      open={openC}
      onClose={closeCarousel}
      TransitionComponent={Transition}
      className={classes.albumPopup}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <IconButton className={classes.closeButton} edge="start" color="inherit" onClick={closeCarousel} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Carousel slides={pictures} pictureId={pictureId} />
    </Dialog>
  );

  return (
    <>
      {breadcrumbs}
      {renderPictures}
      {renderAlbumPopup}
    </>
  );
};

Pictures.propTypes = {
  album: albumShape.isRequired,
};

export default Pictures;
