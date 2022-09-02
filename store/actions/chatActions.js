import axios from "axios";
import absoluteUrl from "next-absolute-url";
import {
  CHAT_LOADING,
  CHAT_LIST_BY_USER,
  GET_CHAT_BY_ID,
  CREATE_CHAT,
} from "../constants/chatConstants";
import { GLOBAL_ALERT } from "../constants/globalConstants";

const getChatsByUser = (authCookie, req) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);
    dispatch({ type: CHAT_LOADING, payload: true });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
    };

    const { data } = await axios.get(`${origin}/api/chats`, config);

    dispatch({ type: CHAT_LOADING, payload: false });

    dispatch({ type: CHAT_LIST_BY_USER, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: GLOBAL_ALERT,
      payload: message,
    });
  }
};

const getChatById = (authCookie, req, id) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
    };

    const { data } = await axios.get(
      `${origin}/api/chats/${id}`,
      config,
    );

    dispatch({ type: GET_CHAT_BY_ID, payload: data });
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

const createChat = (users) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT_LOADING, payload: true });

    const { authCookie } = getState();

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
    };

    const { data } = await axios.post(
      `/api/chats`,
      { users },
      config,
    );

    dispatch({ type: CHAT_LOADING, payload: false });

    dispatch({ type: CREATE_CHAT, payload: data });
    window.location.href = `/chats/${data._id}`;
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

export { getChatsByUser, getChatById, createChat };
