import * as actionType from '../constants/actionTypes';
import { AUTH_DONE, AUTH_ERROR, AUTH_START } from '../constants/actionTypes';
import * as api from '../../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });
    const { email, password } = formData;
    const { data }            = await api.signIn({ email, password });

    dispatch({ type: AUTH_DONE, data });

    router.push('/');
  } catch (error) {
    const detail = error?.response?.data?.detail || error.toString();
    dispatch({ type: AUTH_ERROR, detail });
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH_DONE, data });

    router.push('/');
  } catch (error) {
    const detail = error?.response?.data?.detail || error.toString();
    dispatch({ type: AUTH_ERROR, detail });
  }
};

export const forgot = (formData, router) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });
    const { data } = await api.forgot(formData);

    dispatch({ type: AUTH_DONE, data });

    router.push('/');
  } catch (error) {
    const detail = error?.response?.data?.detail || error.toString();
    dispatch({ type: AUTH_ERROR, detail });
  }
};

export const sendToken = (email) => async (dispatch) => {
  try {
    await api.sendToken(email);
  } catch (error) {
    const detail = error?.response?.data?.detail || error.toString();
    dispatch({ type: AUTH_ERROR, detail });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: actionType.LOGOUT });
};
