import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownload from '@material-ui/icons/CloudDownload';
import { useDispatch, useSelector } from 'react-redux';

import { deletePicture, downloadPicture } from '../../../redux/actions/pictures';
import useStyles from './styles';
import pictureDefault from '../../../images/album-default.png';
import PictureForm from '../PictureForm/PictureForm';
import ConfirmDialog from '../../shared/ConfirmDialog';
import { pictureShape } from '../../shared/shapes';
import { Transition } from '../../shared/Transition';
import { CloudDone, CloudOff, CloudQueue } from '@material-ui/icons';

// Render picture from album
const Picture = ({ picture, mine, openCarousel }) => {
  // State of a Confirmation popup
  const [openC, setOpenC] = useState(false);
  // State of a Edit popup
  const [openE, setOpenE] = useState(false);
  // Statuses of requested pictures
  const statuses          = useSelector((state) => state.download.statuses);

  const dispatch = useDispatch();
  const classes  = useStyles();

  const openConfirm  = useCallback(() => setOpenC(true), []);
  const closeConfirm = useCallback(() => setOpenC(false), []);
  const openEdit     = useCallback(() => setOpenE(true), []);
  const closeEdit    = useCallback(() => setOpenE(false), []);

  // Handle "Download" button
  const giveMe = useCallback(() => dispatch(downloadPicture(picture.id)), [picture.id, dispatch]);

  // Render form to edit picture
  const editForm = (
    <Dialog
      open={openE}
      onClose={closeEdit}
      TransitionComponent={Transition}
    >
      <PictureForm picture={picture} albumId={picture.album_id} handleClose={closeEdit} />
    </Dialog>
  );

  let status;
  switch (statuses[picture.id]) {
  case 'requested':
    // Already requested for download in this session
    status = (
      <Button size="small" color="primary" disabled>
        <CloudQueue fontSize="small" />&nbsp;Awaiting for approval
      </Button>
    );
    break;
  case 'approved':
    // The request was approved
    status = (
      <Button size="small" color="primary" onClick={giveMe}>
        <CloudDone fontSize="small" />&nbsp;Approved
      </Button>
    );
    break;
  case 'denied':
    // Already denied
    status = (
      <Button size="small" color="secondary" onClick={() => {
      }}>
        <CloudOff fontSize="small" />&nbsp;Denied
      </Button>
    );
    break;
  default:
    // May be requested for download
    status = (
      <Button size="small" color="primary" onClick={giveMe}>
        <CloudDownload fontSize="small" />&nbsp;Download Request
      </Button>
    );
  }

  // Check whether should show user's or public picture actions
  const actions = mine ? (
      // Private Album
      <>
        <ConfirmDialog onClose={closeConfirm} onConfirm={() => dispatch(deletePicture(picture.id))} title={
          <div>Are you sure you want to delete?<br />
            <center>Picture: {picture.title}</center>
          </div>
        } open={openC} />
        <Button size="small" color="secondary" onClick={openConfirm}><DeleteIcon fontSize="small" /> Delete</Button>
        <div className={classes.overlay}>
          <Tooltip title="Edit">
            <Button color="primary" size="small" onClick={openEdit}><EditIcon fontSize="small" /></Button>
          </Tooltip>
        </div>
        {editForm}
      </>
    ) :
    // Public Album
    status
  ;

  return (
    <Card className={classes.card}>
      <Link component="button" to="" onClick={() => openCarousel(picture.id)}>
        <CardMedia className={classes.media} image={picture.image || pictureDefault} title={picture.title} />
      </Link>
      <Link className={classes.nohover} component="button" to="" onClick={() => openCarousel(picture.id)}>
        <Typography className={classes.title} gutterBottom variant="h6" component="h2">{picture.title}</Typography>
      </Link>
      <CardContent>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.description}>{picture.description}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>{actions}</CardActions>
    </Card>
  );
};

Picture.propTypes = {
  picture: pictureShape.isRequired,
  mine: PropTypes.bool.isRequired,
  openCarousel: PropTypes.func.isRequired,
};

export default Picture;
