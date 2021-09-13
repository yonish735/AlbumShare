import {
  CREATE_PICTURE_DONE,
  CREATE_PICTURE_ERROR,
  CREATE_PICTURE_START,
  DELETE_PICTURE_DONE,
  DELETE_PICTURE_ERROR,
  DELETE_PICTURE_START,
  DOWNLOAD_PICTURE_DONE,
  DOWNLOAD_PICTURE_ERROR,
  DOWNLOAD_PICTURE_START,
  DOWNLOAD_STATUS_DONE,
  DOWNLOAD_STATUS_ERROR,
  DOWNLOAD_STATUS_START,
  FETCH_ALL_PICTURES_DONE,
  FETCH_ALL_PICTURES_ERROR,
  FETCH_ALL_PICTURES_START,
  UPDATE_PICTURE_DONE,
  UPDATE_PICTURE_ERROR,
  UPDATE_PICTURE_START,
} from '../constants/actionTypes';

import * as api from '../../api/index.js';
import fetchData from './shared';

export const getPictures = (albumId) => async (dispatch) => {
  await fetchData(DOWNLOAD_STATUS_START, DOWNLOAD_STATUS_DONE, DOWNLOAD_STATUS_ERROR,
    async () => {
      const { data } = await api.downloadStatuses(albumId);
      return {
        data: {
          data
        }
      };
    },
    dispatch);
  await fetchData(FETCH_ALL_PICTURES_START, FETCH_ALL_PICTURES_DONE, FETCH_ALL_PICTURES_ERROR,
    () => api.getPictures(albumId),
    dispatch);
};

export const downloadPicture = (id) => async (dispatch) => {
  await fetchData(DOWNLOAD_PICTURE_START, DOWNLOAD_PICTURE_DONE, DOWNLOAD_PICTURE_ERROR,
    async () => {
      const { data } = await api.downloadPicture(id);

      if (data.download === false) {
        dispatch({ type: DOWNLOAD_PICTURE_ERROR, payload: { message: 'Error occurred' } });
      }
      return { data };
    },
    dispatch);
};

export const deletePicture = (id) => async (dispatch) => {
  await fetchData(DELETE_PICTURE_START, DELETE_PICTURE_DONE, DELETE_PICTURE_ERROR,
    () => api.deletePicture(id),
    dispatch);
};

export const createPicture = (picture, filename) => async (dispatch) => {
  picture.filename = filename ?? '';
  await fetchData(CREATE_PICTURE_START, CREATE_PICTURE_DONE, CREATE_PICTURE_ERROR,
    () => api.createPicture(picture),
    dispatch);
};

export const updatePicture = (id, picture, filename) => async (dispatch) => {
  picture.filename = filename ?? '';
  await fetchData(UPDATE_PICTURE_START, UPDATE_PICTURE_DONE, UPDATE_PICTURE_ERROR,
    () => api.updatePicture(id, picture),
    dispatch);
};
