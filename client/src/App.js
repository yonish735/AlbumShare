import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Navbar from './components/Navbar/Navbar';
import HomeAlbums from './components/Home/HomeAlbums';
import HomePictures from './components/Home/HomePictures';
import Downloads from './components/Home/Downloads';
import Auth from './components/Auth/Auth';
import { AUTH_DONE } from './redux/constants/actionTypes';

// Update album theme for our application
const albumTheme = createMuiTheme({
  overrides: {
    // Breadcrumbs
    MuiBreadcrumbs: {
      root: {
        '& a': {
          fontSize: 30,
          color: '#7fb0e0',
        },
        '& p': {
          fontSize: 30,
          color: '#2277ca',
        },
      }
    }
  },
  // Use green color (from logo) as primary color
  palette: {
    primary: {
      500: '#54c25a',
    },
    secondary: {
      main: '#dc004e',
    }
  },
  typography: {
    fontSize: 19,
  },
});

// Main component (application)
const App = () => {
  const dispatch = useDispatch();
  const token    = window.localStorage.getItem('token');

  // Log in in case we got a token
  token && dispatch({ type: AUTH_DONE, data: { token } });

  return (
    <>
      {/* Reset all browsers to a common baseline */}
      <CssBaseline />
      {/* Router */}
      <BrowserRouter>
        <MuiThemeProvider theme={albumTheme}>
          <Container maxWidth="lg">
            <Navbar />
            <Switch>
              {/* User/password manipulations */}
              <Route path="/auth" exact component={Auth} />

              {/* Pictures of one album */}
              <Route path="/albums/:albumId/:mine" exact component={HomePictures} />

              {/* Table of download requests for approval */}
              <Route path="/downloads" component={Downloads} />

              {/* Catch all route; display my albums */}
              <Route path="/" component={HomeAlbums} />
            </Switch>
          </Container>
        </MuiThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
