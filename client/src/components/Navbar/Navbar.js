import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import album from '../../images/album.svg';
import { logout } from '../../redux/actions/auth';
import useStyles from './styles';
import Requests from './Requests';
import { SET_ALBUM_FILTER, SET_PUBLIC_ALBUMS } from '../../redux/constants/actionTypes';
import Grid from '@material-ui/core/Grid';
import { IOSSwitch } from '../shared/IOSSwitch';

// Render navigation bar
const Navbar = () => {
  const user     = useSelector((state) => state.auth.user);
  const { mine } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const history  = useHistory();
  const classes  = useStyles();

  const handleClick = () => {
    dispatch(logout());
  };

  // Set mine/public state
  const setPublic = () => {
    dispatch({ type: SET_ALBUM_FILTER, payload: '' });
    dispatch({
      type: SET_PUBLIC_ALBUMS,
      payload: !mine,
    });
    history.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar className={classes.headerOuter} position="sticky" color="inherit">
      <div className={classes.brandContainer}>
        <img className={classes.image} src={album} alt="logo" height="60" />
        <Typography component={Link} to="/" className={classes.title} variant="h2" align="center"><span className={classes.albumAlbum}>Album</span><span className={classes.blueColor}>Share</span></Typography>
      </div>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item className={classes.greenColor} >My Albums</Grid>
          <Grid item>
            <IOSSwitch name="private" variant="outlined" checked={!mine} onChange={setPublic} />
          </Grid>
          <Grid item className={classes.blueColor}>Public Album</Grid>
        </Grid>
      </Typography>
      <Toolbar className={classes.toolbar}>
        <div className={classes.profile}>
          <Avatar className={classes.avatar} alt={`${user?.firstName} ${user?.lastName}`}>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</Avatar>
          <Requests />
          <Button variant="contained" className={classes.logout} color="primary" onClick={handleClick}>Logout</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {};

export default Navbar;
