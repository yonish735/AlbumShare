import { LOGOUT } from '../constants/actionTypes';

const fetchData = async (START, DONE, ERROR, fetch, dispatch) => {
  try {
    dispatch({ type: START });

    const { data } = await fetch();

    dispatch({ type: DONE, payload: data });
  } catch (error) {
    if (error.message === 'Signature has expired') {
      dispatch({ type: LOGOUT });
      return;
    }
    let message = error.message;
    try {
      message = error.response.data.detail;
    } catch {
    }
    dispatch({ type: ERROR, payload: { message: message } });
    console.log(message);
  }
};

export default fetchData;
