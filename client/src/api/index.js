import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BACKEND;
// Create API with base URL
const API     = axios.create({ baseURL });

// Add Authorization header to each request if token exists
API.interceptors.request.use((req) => {
  const token = window.localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// In case of "401 Unauthorized" response copy it's details to err.message
// as all other messages are expected to be there
API.interceptors.response.use(undefined, (err) => {
  if (err.response.status === 401 && err.response.data.detail === 'Signature has expired') {
    err.message = err.response.data.detail;
  }
  return Promise.reject(err);
});

const albumUrl = '/albums';

export const getAlbums        = () => API.get(`${albumUrl}/`);
export const getPublicAlbums  = () => API.get(`${albumUrl}/public/`);
export const downloadAlbum    = async (id) => API.get(`${albumUrl}/${id}/download`);
export const downloadStatuses = (albumId) => API.get(`${albumUrl}/${albumId}/states`);

export const createAlbum = (newAlbum) => API.post(`${albumUrl}`, newAlbum);
export const deleteAlbum = (id) => API.delete(`${albumUrl}/${id}`);
export const updateAlbum = (id, updatedAlbum, filename) => API.patch(`${albumUrl}/${id}`, updatedAlbum, filename);

const pictureUrl = '/pictures';

export const getPictures     = (albumId) => API.get(`${pictureUrl}/${albumId}`);
export const createPicture   = (newPicture) => API.post(`${pictureUrl}`, newPicture);
export const deletePicture   = (id) => API.delete(`${pictureUrl}/${id}`);
export const updatePicture   = (id, updatedPicture, filename) => API.patch(`${pictureUrl}/${id}`, updatedPicture, filename);
export const downloadPicture = async (id) => API.get(`${pictureUrl}/${id}/download`);

const userUrl = '/users';

export const signIn                 = (data) => API.post(`${userUrl}/signIn`, data);
export const signUp                 = (data) => API.post(`${userUrl}/signUp`, data);
export const sendToken              = (email) => API.get(`${userUrl}/sendToken/${email}`);
export const forgot                 = (data) => API.post(`${userUrl}/forgot`, data);
export const downloadRequests       = () => API.get(`${userUrl}/download`);
export const downloadRequestApprove = (id, permit) => API.get(`${userUrl}/download/permit/${id}/${permit}`);

