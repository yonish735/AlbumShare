import { LOGOUT, SET_ALBUM_FILTER, SET_PUBLIC_ALBUMS, } from '../constants/actionTypes';

const initialFilters = { mine: true, filter: '' };

const reducer = (filters = initialFilters, action) => {
  switch (action.type) {

  case SET_PUBLIC_ALBUMS:
    return {
      ...filters,
      mine: action.payload,
    };
  case SET_ALBUM_FILTER:
    return {
      ...filters,
      filter: action.payload,
    };

  case LOGOUT:
    return initialFilters;

  default:
    return filters;
  }
};

export default reducer;
