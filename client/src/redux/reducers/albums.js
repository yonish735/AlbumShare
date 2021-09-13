import {
  CREATE_ALBUM_CLEAR,
  CREATE_ALBUM_DONE,
  CREATE_ALBUM_ERROR,
  CREATE_ALBUM_START,
  DELETE_ALBUM_DONE,
  DELETE_ALBUM_ERROR,
  DELETE_ALBUM_START,
  FETCH_ALL_ALBUMS_DONE,
  FETCH_ALL_ALBUMS_ERROR,
  FETCH_ALL_ALBUMS_START,
  FETCH_PUBLIC_ALBUMS_DONE,
  FETCH_PUBLIC_ALBUMS_ERROR,
  FETCH_PUBLIC_ALBUMS_START,
  LOGOUT,
  SET_ALBUM_FILTER,
  SET_ALBUM_ID,
  SET_PUBLIC_ALBUMS,
  UPDATE_ALBUM_DONE,
  UPDATE_ALBUM_ERROR,
  UPDATE_ALBUM_START,
} from '../constants/actionTypes';

const initialAlbums = { albums: [], WIP: false, error: false, created: false, createError: false, mine: true, albumId: undefined, filter: '' };

const reducer = (albums = initialAlbums, action) => {
  switch (action.type) {
  case FETCH_ALL_ALBUMS_START:
    return {
      ...albums,
      albums: [],
      WIP: true,
    };
  case FETCH_ALL_ALBUMS_DONE:
    return {
      ...albums,
      albums: action.payload,
      WIP: false,
      error: false,
    };
  case FETCH_ALL_ALBUMS_ERROR:
    return {
      albums: [],
      WIP: false,
      error: action.payload.message,
    };

  case FETCH_PUBLIC_ALBUMS_START:
    return {
      ...albums,
      albums: [],
      WIP: true,
    };
  case FETCH_PUBLIC_ALBUMS_DONE:
    return {
      ...albums,
      albums: action.payload,
      WIP: false,
      error: false,
    };
  case FETCH_PUBLIC_ALBUMS_ERROR:
    return {
      albums: [],
      WIP: false,
      error: action.payload.message,
    };

  case SET_PUBLIC_ALBUMS:
    return {
      ...albums,
      mine: action.payload,
    };
  case SET_ALBUM_ID:
    return {
      ...albums,
      albumId: action.payload,
    };
  case SET_ALBUM_FILTER:
    return {
      ...albums,
      filter: action.payload,
    };

  case CREATE_ALBUM_START:
    return {
      ...albums,
      WIP: true,
      createError: false,
      created: false,
    };
  case CREATE_ALBUM_DONE:
    return {
      albums: [action.payload, ...albums.albums],
      WIP: false,
      createError: false,
      created: true,
    };
  case CREATE_ALBUM_ERROR:
    return {
      ...albums,
      WIP: false,
      error: false,
      createError: action.payload.message,
      created: false,
    };

  case DELETE_ALBUM_START:
    return {
      ...albums,
      WIP: true,
      error: false,
    };
  case DELETE_ALBUM_DONE:
    const id = parseInt(action.payload);
    return {
      albums: [...albums.albums.filter((album) => album.id !== id)],
      WIP: false,
    };
  case DELETE_ALBUM_ERROR:
    return {
      albums: [],
      WIP: false,
      error: action.payload.message,
    };

  case UPDATE_ALBUM_START:
    return {
      ...albums,
      WIP: true,
      error: false,
      createError: false,
      created: false,
    };
  case UPDATE_ALBUM_DONE:
    return {
      albums: [...albums.albums.map((album) => (album.id === action.payload.id ? action.payload : album))],
      WIP: false,
      createError: false,
      created: true,
    };
  case UPDATE_ALBUM_ERROR:
    return {
      ...albums,
      WIP: false,
      createError: action.payload.message,
      created: false,
    };

  case CREATE_ALBUM_CLEAR:
    return {
      ...albums,
      created: false,
      createError: false,
    };

  case LOGOUT:
    return initialAlbums;

  default:
    return albums;
  }
};

export default reducer;
