import {
  DOWNLOAD_REQ_DONE,
  DOWNLOAD_REQ_ERROR,
  DOWNLOAD_REQ_START,
  DOWNLOAD_SET_DONE,
  DOWNLOAD_SET_ERROR,
  DOWNLOAD_SET_START,
  DOWNLOAD_STATUS_DONE,
  DOWNLOAD_STATUS_ERROR,
  DOWNLOAD_STATUS_START
} from '../constants/actionTypes';
import * as api from '../../api/index.js';

export const downloadRequests = () => async (dispatch) => {
  try {
    dispatch({ type: DOWNLOAD_REQ_START });
    const { data } = await api.downloadRequests();
    dispatch({ type: DOWNLOAD_REQ_DONE, payload: { data } });
  } catch (error) {
    dispatch({ type: DOWNLOAD_REQ_ERROR, payload: { message: error.message } });
    console.log(error.message);
  }
};

export const downloadRequestApprove = (id, permit) => async (dispatch) => {
  try {
    dispatch({ type: DOWNLOAD_SET_START, payload: { id } });
    await api.downloadRequestApprove(id, permit);
    dispatch({ type: DOWNLOAD_SET_DONE, payload: { id } });
  } catch (error) {
    dispatch({ type: DOWNLOAD_SET_ERROR, payload: { message: error.message } });
    console.log(error.message);
  }
};

export const downloadStatuses = (albumId) => async (dispatch) => {
  const parsed = parseInt(albumId, 10);
  if (!Number.isInteger(parsed)) {
    return;
  }
  try {
    dispatch({ type: DOWNLOAD_STATUS_START });
    const { data } = await api.downloadStatuses(albumId);
    dispatch({ type: DOWNLOAD_STATUS_DONE, payload: { data } });
  } catch (error) {
    dispatch({ type: DOWNLOAD_STATUS_ERROR, payload: { message: error.message } });
    console.log(error.message);
  }
};

