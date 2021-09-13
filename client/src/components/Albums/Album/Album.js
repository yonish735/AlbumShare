import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';

import { deleteAlbum, downloadAlbum } from '../../../redux/actions/albums';
import albumDefault from '../../../images/album-default.png';
import ConfirmDialog from '../../shared/ConfirmDialog';
import dayjs from 'dayjs';
import AlbumForm from '../AlbumForm/AlbumForm';
import { albumShape } from '../../shared/shapes';
import { Transition } from '../../shared/Transition';

import useStyles from './styles';
import CheckBox from '@material-ui/icons/CheckBox';
import CloudDownload from '@material-ui/icons/CloudDownload';

// Render a single album
const Album = ({ album, mine }) => {
  // State of a Confirmation popup
  const [openC, setOpenC]       = useState(false);
  // State of a Edit popup
  const [openE, setOpenE]       = useState(false);
  const { albumId, WIP, error } = useSelector((state) => state.download);
  const wasRequested            = WIP === false && error === false && album.id === albumId;

  const dispatch = useDispatch();
  const history  = useHistory();

  const classes = useStyles();

  const openConfirm  = useCallback(() => setOpenC(true), []);
  const closeConfirm = useCallback(() => setOpenC(false), []);
  const openEdit     = useCallback(() => setOpenE(true), []);
  const closeEdit    = useCallback(() => setOpenE(false), []);

  // Handle "Download" button
  const giveMe = useCallback(() => dispatch(downloadAlbum(album.id)), [album.id, dispatch]);

  // Render form to edit album
  const editForm = (
    <Dialog
      open={openE}
      onClose={closeEdit}
      TransitionComponent={Transition}
    >
      <AlbumForm album={album} handleClose={closeEdit} />
    </Dialog>
  );

  const tooltipIcon  = album.private ? <LockOutlinedIcon fontSize="large" /> : <LockOpenOutlinedIcon fontSize="large" />;
  const tooltipTitle = album.private ? 'Private' : 'Public';

  const day            = dayjs(album.created_at).format('DD/MM/YYYY');
  const cardData       = !mine && (
    <>
      <Typography variant="body2" color="textSecondary" className={classes.createdBy} component="p">By: {album.user?.first_name} {album.user?.last_name}</Typography>
      <Typography variant="body2" color="textSecondary" component="p">Created on: {day}</Typography>
    </>
  );
  // Private Album
  const privateActions = (
    <CardActions className={classes.cardActions}>
      <ConfirmDialog onClose={closeConfirm} onConfirm={() => dispatch(deleteAlbum(album.id))} title={
        <div>Are you sure you want to delete?<br />
          <center>Album: {album.title}</center>
        </div>
      } open={openC} />
      <Button size="small" color="secondary" onClick={openConfirm}><DeleteIcon fontSize="small" /> Delete</Button>
      <Tooltip className={classes.gray} s title={tooltipTitle}>{tooltipIcon}</Tooltip>
      <div className={classes.overlay}>
        <Tooltip title="Edit">
          <Button color="primary" size="small" onClick={openEdit}><EditIcon fontSize="small" /></Button>
        </Tooltip>
      </div>
      {editForm}
    </CardActions>
  );
  const downloadIcon   = wasRequested ? <><CheckBox fontSize="small" /> &nbsp;Awaiting for approval</> : <><CloudDownload fontSize="small" /> &nbsp;Request to download album</>;
  // Public Album
  const publicActions  = (
    <CardActions className={classes.cardActions}>
      <Button size="small" color="primary" disabled={wasRequested} onClick={giveMe}>
        {downloadIcon}
      </Button>
    </CardActions>
  );
  // Check whether should show user's or public album actions
  const cardActions    = mine ? privateActions : publicActions;

  return (
    <Card className={classes.card}>
      <Link onClick={() => history.push(`/albums/${album.id}/${mine}`)} to="" component="button">
        <CardMedia className={classes.media} image={album.image || albumDefault} title={album.title} />
      </Link>
      <Badge badgeContent={album.pictures.length} max={99} color="primary" className={classes.badge} />
      <Link className={classes.nohover} onClick={() => history.push(`/albums/${album.id}/${mine}`)} to="" component="button">
        <Typography className={classes.title} gutterBottom variant="h6" component="h2">{album.title}</Typography>
      </Link>
      <CardContent>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.description}>{album.description}</Typography>
        {cardData}
      </CardContent>
      {cardActions}
    </Card>
  );
};

Album.propTypes = {
  album: albumShape,
  mine: PropTypes.bool.isRequired,
};

export default Album;
