import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { downloadRequestApprove } from '../../redux/actions/download';
import useStyles from './styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import { DOWNLOAD_SET_INDOWNLOAD } from '../../redux/constants/actionTypes';
import { TableSortLabel } from '@material-ui/core';

const breadcrumbs = (classes) => (
  <Breadcrumbs separator="›" className={classes.breadcrumbs}>
    <Link color="inherit" href="/">My Albums</Link>
    <Typography color="textPrimary">Download Requests</Typography>
  </Breadcrumbs>
);

// Compare `orderBy` attribute of items `a` and `b` in descending order
// Return -1 in case a > b, +1 in case a < b, 0 otherwise
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

// Return a function that will be able to compare two objects
const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Sort an array of rows using `comparator` function
const stableSort = (array, comparator) => {
  // Replace items in array with tuples [item, index of this item in the original array]
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    // Compare elements; order will be -1/0/+1
    const order = comparator(a[0], b[0]);
    // If these elements are different, then return
    if (order !== 0) {
      return order;
    }
    // If these elements are equal, the order will be calculated based on their order in the original array
    return a[1] - b[1];
  });
  // Remove indexes and keep only items themselves
  return stabilized.map(el => el[0]);
};

// Render table with Download Requests
const Downloads = () => {
  let { downloads, derror, download: dID, WIP } = useSelector((state) => state.download);

  // Direction of sorting
  const [order, setOrder]     = React.useState('asc');
  // Field to sort by
  const [orderBy, setOrderBy] = React.useState('requested');

  const user     = useSelector((state) => state.auth.user);
  const history  = useHistory();
  const dispatch = useDispatch();
  const classes  = useStyles();

  const permit = (id, permit) => dispatch(downloadRequestApprove(id, permit));

  // Handle click on sorting arrow
  const handleRequestSort = (event, property) => {
    // Click on the current arrow -- just flip direction
    // Click on a new arrow -- force current order to be 'desc', so it will be flipped to 'asc' (default order)
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Generate header (<th>) of a sortable column
  const sortableTableCell = ({ columnName, label }) =>
    <TableCell
      key={columnName}
      className={classes.textCenter}
      sortDirection={orderBy === columnName ? order : false}
      onClick={event => handleRequestSort(event, columnName)}
    >
      <TableSortLabel
        active={true}
        className={clsx({
          [classes.greenText]: orderBy === columnName,
        })}
        direction={orderBy === columnName ? order : 'asc'}
      >
        {label}
      </TableSortLabel>
    </TableCell>;

  // Stop updating list of Download Requests while on Download page
  useEffect(() => {
    dispatch({ type: DOWNLOAD_SET_INDOWNLOAD, payload: true });
    return () => {
      dispatch({ type: DOWNLOAD_SET_INDOWNLOAD, payload: false });
    };
  }, [dispatch]);

  if (user === null) {
    history.push('/auth');
    return null;
  }

  if (downloads.length === 0 && !WIP) {
    return (
      <>
        {breadcrumbs(classes)}
        <Typography component="h3" to="/" variant="h3" align="center"> No requests </Typography>
      </>
    );
  }

  // Map Download requests to the structure suitable to render a table
  // Each attribute will be a separate column
  const rows = downloads.map(d => ({
      id: d.id,
      requestor: `${d.requestor.first_name} ${d.requestor.last_name}`,
      email: d.requestor.email,
      requested: dayjs(d.created_at).format('DD/MM/YYYY'),
      album: d.album.title,
      pictureName: d.picture.title,
      pictureImage: d.picture.image,
    })
  );
  // Sort the above rows according to:
  // order - asc/desc
  // orderBy - column attribute name
  const sorted = stableSort(rows, getComparator(order, orderBy));

  return (
    <>
      {breadcrumbs(classes)}
      {WIP && <CircularProgress />}
      <Paper className={classes.root}>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {sortableTableCell({ key: 'requestor', label: 'Requestor' })}
                {sortableTableCell({ key: 'email', label: 'Email' })}
                {sortableTableCell({ key: 'requested', label: 'Request Date' })}
                {sortableTableCell({ key: 'album', label: 'Album' })}
                <TableCell key="picture">Picture</TableCell>
                {sortableTableCell({ key: 'pictureName', label: 'Picture Name' })}
                <TableCell key="actions">&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell key={`r-${row.id}`} padding="checkbox">{row.requestor}</TableCell>
                    <TableCell key={`rn-${row.id}`} padding="checkbox">{row.email}</TableCell>
                    <TableCell key={`d-${row.id}`} padding="checkbox">{row.requested}</TableCell>
                    <TableCell key={`g-${row.id}`} padding="checkbox">{row.album}</TableCell>
                    <TableCell key={`p-${row.id}`} padding="checkbox">
                      <img width="50px" src={row.pictureImage} alt={row.pictureName} />
                    </TableCell>
                    <TableCell key={`pn-${row.id}`} padding="checkbox">{row.pictureName}</TableCell>
                    <TableCell key={`a-${row.id}`} className={classes.actions} align="right" padding="checkbox">
                      {dID === row.id && !derror && <CircularProgress size="1rem" />}
                      {dID === row.id && derror && <Alert variant="filled" severity="error">{derror}</Alert>}
                      <ButtonGroup size="small">
                        <Button variant="contained" color="primary" className={classes.buttons} onClick={() => permit(row.id, true)}>Permit</Button>
                        <Button variant="contained" color="secondary" className={classes.buttons} onClick={() => permit(row.id, false)}>Refuse</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

Downloads.propTypes = {};

export default Downloads;
