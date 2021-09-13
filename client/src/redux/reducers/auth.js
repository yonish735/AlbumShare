import jwt_decode from 'jwt-decode';

import { AUTH_DONE, AUTH_ERROR, AUTH_START, LOGOUT } from '../constants/actionTypes';

const initialAuth = { user: null, token: null, WIP: false, errors: null };

const reducer = (auth = initialAuth, action) => {
  switch (action.type) {
  case AUTH_START:
    return { ...initialAuth, WIP: true };
  case AUTH_DONE:
    const { token } = action.data;
    const decoded   = jwt_decode(token);
    const user      = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.first_name,
      lastName: decoded.last_name,
    };
    window.localStorage.setItem('token', token);
    return {
      ...initialAuth,
      user,
      token,
    };
  case AUTH_ERROR:
    return {
      ...initialAuth,
      errors: action?.detail
    };

  case LOGOUT:
    window.localStorage.removeItem('token');
    return { ...initialAuth };

  default:
    return auth;
  }

};

export default reducer;
