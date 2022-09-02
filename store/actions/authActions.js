import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import {
  USER_LOGOUT,
  USER_LOADING_ACTION,
  AUTHENTICATE,
} from '../constants/authConstants';
import { GLOBAL_ALERT } from '../constants/globalConstants';

const register =
  (name, email, password, passwordConfirm) => async (dispatch) => {
    try {
      dispatch({
        type: USER_LOADING_ACTION,
        payload: true,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/register',
        { name, email, password, passwordConfirm },
        config
      );

      dispatch({
        type: USER_LOADING_ACTION,
        payload: false,
      });

      Cookies.set('token', data.token, {
        expires: 1,
        path: '/',
      });
      dispatch({ type: AUTHENTICATE, payload: data.token });
      window.location.href = '/';
    } catch (error) {
      dispatch({
        type: GLOBAL_ALERT,
        payload: error.response.data.error.errors,
      });
    }
  };

const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOADING_ACTION,
      payload: true,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/auth/login',
      { email, password },
      config
    );

    dispatch({
      type: USER_LOADING_ACTION,
      payload: false,
    });

    Cookies.set('token', data.token, {
      expires: 1,
      path: '/',
    });
    dispatch({ type: AUTHENTICATE, payload: data.token });
    window.location.href = '/';
  } catch (error) {
    dispatch({
      type: GLOBAL_ALERT,
      payload: error.response.data.message,
    });
  }
};

const logout = () => async (dispatch) => {
  try {
    Cookies.remove('token');
    await axios.get('/api/auth/logout');
    dispatch({ type: USER_LOGOUT });
    Router.push('/login');
    Router.reload();
  } catch (err) {
    console.log(err);
  }
};

const authCookie = (authCookie) => (dispatch) => {
  dispatch({ type: AUTHENTICATE, payload: authCookie });
};

export { register, login, logout, authCookie };
