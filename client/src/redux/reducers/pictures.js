import {
  CREATE_PICTURE_CLEAR,
  CREATE_PICTURE_DONE,
  CREATE_PICTURE_ERROR,
  CREATE_PICTURE_START,
  DELETE_PICTURE_DONE,
  DELETE_PICTURE_ERROR,
  DELETE_PICTURE_START,
  FETCH_ALL_PICTURES_DONE,
  FETCH_ALL_PICTURES_ERROR,
  FETCH_ALL_PICTURES_START,
  FETCH_PUBLIC_PICTURES_DONE,
  FETCH_PUBLIC_PICTURES_ERROR,
  FETCH_PUBLIC_PICTURES_START,
  LOGOUT,
  UPDATE_PICTURE_DONE,
  UPDATE_PICTURE_ERROR,
  UPDATE_PICTURE_START
} from '../constants/actionTypes';

const initialPictures = { pictures: [], WIP: false, error: false, created: false, createError: false };

const reducer = (pictures = initialPictures, action) => {
  switch (action.type) {
  case FETCH_ALL_PICTURES_START:
  case FETCH_PUBLIC_PICTURES_START:
    return {
      ...pictures,
      WIP: true,
      error: false,
    };
  case FETCH_ALL_PICTURES_DONE:
  case FETCH_PUBLIC_PICTURES_DONE:
    return {
      pictures: action.payload,
      WIP: false,
      error: false,
    };
  case FETCH_ALL_PICTURES_ERROR:
  case FETCH_PUBLIC_PICTURES_ERROR:
    return {
      pictures: [],
      WIP: false,
      error: action.payload.message,
    };

  case CREATE_PICTURE_START:
    return {
      ...pictures,
      WIP: true,
      error: false,
      created: false,
    };
  case CREATE_PICTURE_DONE:
    return {
      pictures: [action.payload, ...pictures.pictures],
      WIP: false,
      createError: false,
      created: true,
    };
  case CREATE_PICTURE_ERROR:
    return {
      pictures: [],
      WIP: false,
      error: action.payload.message,
      createError: action.payload.message,
      created: false,
    };

  case DELETE_PICTURE_START:
    return {
      ...pictures,
      WIP: true,
      error: false,
    };
  case DELETE_PICTURE_DONE:
    const id = parseInt(action.payload);
    return {
      pictures: [...pictures.pictures.filter((picture) => picture.id !== id)],
      WIP: false,
    };
  case DELETE_PICTURE_ERROR:
    return {
      pictures: [],
      WIP: false,
      error: action.payload.message,
    };

  case UPDATE_PICTURE_START:
    return {
      ...pictures,
      WIP: true,
      error: false,
      created: false,
    };
  case UPDATE_PICTURE_DONE:
    return {
      pictures: [...pictures.pictures.map((picture) => (picture.id === action.payload.id ? action.payload : picture))],
      WIP: false,
      createError: false,
      created: true,
    };
  case UPDATE_PICTURE_ERROR:
    return {
      pictures: [],
      WIP: false,
      createError: action.payload.message,
      created: false,
    };

  case CREATE_PICTURE_CLEAR:
    return {
      ...pictures,
      created: false,
      createError: false,
    };

  case LOGOUT:
    return initialPictures;

  default:
    return pictures;
  }
};

export default reducer;
