import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { useHistory, useParams } from 'react-router-dom';

import { getAlbums, getPublicAlbums } from '../../redux/actions/albums';
import ScrollTop from '../ScrollTop/ScrollTop';
import Pictures from '../Pictures/Pictures';
import { getPictures } from '../../redux/actions/pictures';
import { SET_ALBUM_ID, SET_PUBLIC_ALBUMS } from '../../redux/constants/actionTypes';

// Render album (actually pictures of it)
const HomePictures = () => {
  const user            = useSelector((state) => state.auth.user);
  const { albums, WIP } = useSelector((state) => state.albums);
  const history         = useHistory();
  const dispatch        = useDispatch();

  const { albumId, mine: mineParam } = useParams();
  const mine                         = mineParam === 'true';

  const gId   = parseInt(albumId);
  const album = albums.find(g => g.id === gId);

  // In case it is a reload of page let's set `mine` and current album id
  useEffect(() => {
    dispatch({
      type: SET_PUBLIC_ALBUMS,
      payload: mine,
    });
  }, [mine, dispatch]);
  useEffect(() => {
    dispatch({ type: SET_ALBUM_ID, payload: albumId });

    return () => {
      dispatch({ type: SET_ALBUM_ID, payload: undefined });
    };
  }, [albumId, dispatch]);

  // Fetch albums in case they were not fetched yet
  useEffect(() => {
    if (user && !WIP && albums.length === 0) {
      if (mine) {
        // Fetch albums of the user
        dispatch(getAlbums());
      } else {
        // Fetch albums of the user
        dispatch(getPublicAlbums());
      }
    }
  }, [dispatch, albums, user, WIP, mine]);

  // Fetch pictures in case they were not fetched yet
  useEffect(() => {
    if (user && albums.length !== 0) {
      dispatch(getPictures(albumId));
    }
  }, [dispatch, albumId, albums, user]);

  if (user === null) {
    history.push('/auth');
    return null;
  }

  if (albums.length === 0) {
    return null;
  }

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={12}>
            <div id="back-to-top-anchor" />
            <Pictures album={album} />
            <ScrollTop>
              <Fab color="primary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUp />
              </Fab>
            </ScrollTop>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

HomePictures.propTypes = {};

export default HomePictures;
