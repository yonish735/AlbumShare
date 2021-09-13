import React from 'react';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import MailIcon from '@material-ui/icons/Mail';
import { useDispatch, useSelector } from 'react-redux';

import { downloadRequests, downloadStatuses } from '../../redux/actions/download';
import useInterval from '../shared/UseInterval';
import useStyles from './styles';

// Envelope icon with number of Download requests
const Requests = () => {
  const downloadReq = useSelector((state) => state.download.downloads);
  const inDownload  = useSelector((state) => state.download.inDownload);

  const albumId  = useSelector((state) => state.albums.albumId);
  const dispatch = useDispatch();
  const classes  = useStyles();

  useInterval(() => {
    dispatch(downloadRequests());
  }, inDownload ? null : 120000);

  useInterval(() => {
    dispatch(downloadStatuses(albumId));
  }, 5000);

  if (downloadReq.length <= 0) {
    return null;
  }
  return (
    <Link href="/downloads">
      <Badge badgeContent={downloadReq.length} max={99} color="primary">
        <MailIcon className={classes.mail} />
      </Badge>
    </Link>
  );
};

Requests.propTypes = {};

export default Requests;
