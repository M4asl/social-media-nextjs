import axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import cookie from 'js-cookie';
import {
  POST_LIST_NEWS_FEED,
  POST_LIST_BY_USER,
  POST_CREATE,
  POST_UPDATE,
  POST_REMOVE,
  POST_LOADING,
  UPDATE_POSTS_SCROLL,
  NO_MORE_DATA,
} from '../constants/postConstants';
import { GLOBAL_ALERT } from '../constants/globalConstants';
import { logout } from './authActions';

const listNewsFeed = (authCookie, req) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);
    dispatch({ type: POST_LOADING, payload: true });

    const config = {
      headers: {
        Cookie: authCookie,
      },
      params: { pageNumber: 1 },
    };

    const { data } = await axios.get(
      `${origin}/api/posts/feed`,
      config
    );

    dispatch({
      type: POST_LIST_NEWS_FEED,
      payload: data,
    });

    dispatch({
      type: POST_LOADING,
      payload: false,
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

const updatePostScroll = (pageNumber) => async (dispatch) => {
  try {
    dispatch({ type: POST_LOADING, payload: true });

    const config = {
      headers: { Authorization: cookie.get('token') },
      params: { pageNumber },
    };

    const { data } = await axios.get(
      `${origin}/api/posts/feed`,
      config
    );

    dispatch({
      type: UPDATE_POSTS_SCROLL,
      payload: data,
    });

    if (data.length === 0) {
      dispatch({ type: POST_LOADING, payload: false });
      dispatch({ type: NO_MORE_DATA, payload: true });
    }

    dispatch({
      type: POST_LOADING,
      payload: false,
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

const listByUser = (authCookie, id, req) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);
    dispatch({ type: POST_LOADING, payload: true });

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    };

    const { data } = await axios.get(
      `${origin}/api/posts/by/${id}`,
      config
    );

    console.log(data);

    dispatch({ type: POST_LIST_BY_USER, payload: data });
    dispatch({
      type: POST_LOADING,
      payload: false,
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

const createPost =
  (post, currentUserDetails) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_LOADING, payload: true });

      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      const { data } = await axios.post(
        `/api/posts/new/${currentUserDetails._id}`,
        post,
        config
      );

      console.log(data);

      dispatch({ type: POST_LOADING, payload: false });
      dispatch({ type: POST_CREATE, payload: data });
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

const removePost = (id) => async (dispatch, getState) => {
  dispatch({ type: POST_REMOVE, payload: id });
  try {
    const { authCookie } = getState();

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    };
    await axios.delete(`/api/posts/${id}`, config);
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

const likePost =
  (post, currentUser) => async (dispatch, getState) => {
    const postId = post._id;
    const currentUserId = currentUser._id;

    const newPost = {
      ...post,
      likes: [...post.likes, currentUser],
    };
    dispatch({ type: POST_UPDATE, payload: newPost });
    try {
      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      await axios.put(
        '/api/posts/like',
        { postId, likeId: currentUserId },
        config
      );
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

const unlikePost =
  (post, currentUser) => async (dispatch, getState) => {
    const postId = post._id;
    const currentUserId = currentUser._id;

    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like._id !== currentUserId),
    };
    dispatch({ type: POST_UPDATE, payload: newPost });
    try {
      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      await axios.put(
        '/api/posts/unlike',
        { postId, unlikeId: currentUserId },
        config
      );
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

const createComment =
  (userId, newComment, post) => async (dispatch, getState) => {
    const postId = post._id;
    const { text } = newComment;
    const newPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    dispatch({ type: POST_UPDATE, payload: newPost });
    try {
      const { authCookie } = getState();

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: authCookie,
        },
      };

      const { data } = await axios.put(
        '/api/posts/comment',
        { userId, postId, comment: { text } },
        config
      );
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

const uncomment = (post, commentId) => async (dispatch, getState) => {
  const postId = post._id;
  const newPost = {
    ...post,
    comments: post.comments.filter(
      (comment) => comment._id !== commentId
    ),
  };
  dispatch({ type: POST_UPDATE, payload: newPost });
  try {
    const { authCookie } = getState();

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
    };

    await axios.put(
      '/api/posts/uncomment',
      { postId, comment: { _id: commentId } },
      config
    );
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
  listNewsFeed,
  listByUser,
  createPost,
  removePost,
  likePost,
  unlikePost,
  createComment,
  uncomment,
  updatePostScroll,
};
