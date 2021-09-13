import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { useHistory } from 'react-router-dom';
import Albums from '../Albums/Albums';
import ScrollTop from '../ScrollTop/ScrollTop';

// Homepage (my/public albums)
const HomeAlbums = () => {
  const user    = useSelector((state) => state.auth.user);
  const history = useHistory();

  // Do not permit to enter homepage without being logged in
  if (user === null) {
    history.push('/auth');
    return null;
  }

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={12}>
            <div id="back-to-top-anchor" />
            {/* Render albums */}
            <Albums />
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

HomeAlbums.propTypes = {};

export default HomeAlbums;
