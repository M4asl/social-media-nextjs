import axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import {
  USER_LOADING,
  USER_LIST,
  USER_FIND_PEOPLE,
  USER_EDIT_PROFILE,
  USER_DELETE,
  USER_FOLLOW,
  USER_UNFOLLOW,
  USER_DETAILS,
  CURRENT_USER_PROFILE_DETAILS,
  UPDATE_CURRENT_USER_FOLLOWING_FOLLOW,
  UPDATE_CURRENT_USER_FOLLOWING_UNFOLLOW,
} from '../constants/userConstants';

import { GLOBAL_ALERT } from '../constants/globalConstants';
import { logout } from './authActions';

const getCurrentUserDetails =
  (authCookie, req) => async (dispatch) => {
    try {
      const { origin } = absoluteUrl(req);

      dispatch({
        type: USER_LOADING,
        payload: true,
      });

      const config = {
        headers: {
          Cookie: authCookie,
        },
      };

      const { data } = await axios.get(
        `${origin}/api/auth/me`,
        config
      );

      dispatch({
        type: CURRENT_USER_PROFILE_DETAILS,
        payload: data,
      });

      dispatch({
        type: USER_LOADING,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: GLOBAL_ALERT,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

const getUsersList =
  (userData = '', authCookie, req) =>
  async (dispatch) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });

      const { origin } = absoluteUrl(req);

      const config = {
        headers: {
          Cookie: authCookie,
        },
      };

      const { data } = await axios.get(
        `${origin}/api/users?search=${userData}`,
        config
      );

      dispatch({ type: USER_LOADING, payload: false });

      dispatch({ type: USER_LIST, payload: data });
    } catch (error) {
      dispatch({
        type: GLOBAL_ALERT,
        payload: {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        },
      });
    }
  };

const getUserDetails = (id, authCookie, req) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOADING, payload: true });

    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        Cookie: authCookie,
      },
    };

    const { data } = await axios.get(
      `${origin}/api/users/${id}`,
      config
    );

    dispatch({ type: USER_LOADING, payload: false });

    dispatch({ type: USER_DETAILS, payload: data });
  } catch (error) {
    dispatch({
      type: GLOBAL_ALERT,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const editUserProfile =
  (user, userId) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });

      console.log(user);

      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      const { data } = await axios.put(
        `/api/users/${userId}`,
        user,
        config
      );

      dispatch({ type: USER_LOADING, payload: false });

      dispatch({
        type: USER_EDIT_PROFILE,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: GLOBAL_ALERT,
        payload: message,
      });
    }
  };

const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOADING, payload: true });

    const { authCookie } = getState();

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch({ type: USER_LOADING, payload: false });

    dispatch({ type: USER_DELETE });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: GLOBAL_ALERT,
      payload: message,
    });
  }
};

const follow = (userId, followId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOADING, payload: true });

    const { authCookie } = getState();

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    };

    const { data } = await axios.put(
      `/api/users/follow`,
      { userId, followId },
      config
    );
    dispatch({ type: USER_LOADING, payload: false });

    dispatch({ type: USER_FOLLOW, payload: data });
    dispatch({
      type: UPDATE_CURRENT_USER_FOLLOWING_FOLLOW,
      payload: followId,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: GLOBAL_ALERT,
      payload: message,
    });
  }
};

const unfollow =
  (userId, unfollowId) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });

      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      const { data } = await axios.put(
        '/api/users/unfollow',
        { userId, unfollowId },
        config
      );

      dispatch({ type: USER_LOADING, payload: false });

      dispatch({ type: USER_UNFOLLOW, payload: data });
      dispatch({
        type: UPDATE_CURRENT_USER_FOLLOWING_UNFOLLOW,
        payload: unfollowId,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: GLOBAL_ALERT,
        payload: message,
      });
    }
  };

const findPeople =
  (authCookie, req) => async (dispatch, getState) => {
    try {
      const { origin } = absoluteUrl(req);

      dispatch({ type: USER_LOADING, payload: true });

      const {
        userReducer: { currentUserDetails },
      } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      const { data } = await axios.get(
        `${origin}/api/users/findpeople/${currentUserDetails._id}`,
        config
      );

      dispatch({ type: USER_LOADING, payload: false });

      dispatch({ type: USER_FIND_PEOPLE, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: GLOBAL_ALERT,
        payload: message,
      });
    }
  };

export {
  getUsersList,
  getUserDetails,
  editUserProfile,
  deleteUser,
  follow,
  unfollow,
  findPeople,
  getCurrentUserDetails,
};
