import {
  CREATE_ALBUM_DONE,
  CREATE_ALBUM_ERROR,
  CREATE_ALBUM_START,
  DELETE_ALBUM_DONE,
  DELETE_ALBUM_ERROR,
  DELETE_ALBUM_START,
  DOWNLOAD_ALBUM_DONE,
  DOWNLOAD_ALBUM_ERROR,
  DOWNLOAD_ALBUM_START,
  FETCH_ALL_ALBUMS_DONE,
  FETCH_ALL_ALBUMS_ERROR,
  FETCH_ALL_ALBUMS_START,
  FETCH_PUBLIC_ALBUMS_DONE,
  FETCH_PUBLIC_ALBUMS_ERROR,
  FETCH_PUBLIC_ALBUMS_START,
  UPDATE_ALBUM_DONE,
  UPDATE_ALBUM_ERROR,
  UPDATE_ALBUM_START
} from '../constants/actionTypes';

import * as api from '../../api/index.js';
import fetchData from './shared';

export const getAlbums = () => async (dispatch) => {
  await fetchData(FETCH_ALL_ALBUMS_START, FETCH_ALL_ALBUMS_DONE, FETCH_ALL_ALBUMS_ERROR,
    () => api.getAlbums(),
    dispatch);
};

export const getPublicAlbums = () => async (dispatch) => {
  await fetchData(FETCH_PUBLIC_ALBUMS_START, FETCH_PUBLIC_ALBUMS_DONE, FETCH_PUBLIC_ALBUMS_ERROR,
    () => api.getPublicAlbums(),
    dispatch);
};

export const createAlbum = (album, filename) => async (dispatch) => {
  album.filename = filename ?? '';
  await fetchData(CREATE_ALBUM_START, CREATE_ALBUM_DONE, CREATE_ALBUM_ERROR,
    () => api.createAlbum(album),
    dispatch);
};

export const updateAlbum = (id, album, filename) => async (dispatch) => {
  album.filename = filename ?? '';
  await fetchData(UPDATE_ALBUM_START, UPDATE_ALBUM_DONE, UPDATE_ALBUM_ERROR,
    () => api.updateAlbum(id, album),
    dispatch);
};

export const deleteAlbum = (id) => async (dispatch) => {
  await fetchData(DELETE_ALBUM_START, DELETE_ALBUM_DONE, DELETE_ALBUM_ERROR,
    () => api.deleteAlbum(id),
    dispatch);
};

export const downloadAlbum = (id) => async (dispatch) => {
  await fetchData(DOWNLOAD_ALBUM_START, DOWNLOAD_ALBUM_DONE, DOWNLOAD_ALBUM_ERROR,
    async () => {
      const { data } = await api.downloadAlbum(id);

      if (data.download === false) {
        dispatch({ type: DOWNLOAD_ALBUM_ERROR, payload: { message: 'Error occurred' } });
      }
      return { data };
    },
    dispatch);
};

