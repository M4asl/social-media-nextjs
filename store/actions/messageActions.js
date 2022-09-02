import axios from "axios";
import absoluteUrl from "next-absolute-url";
import cookie from "js-cookie";
import {
  MESSAGE_LOADING,
  MESSAGES_BY_CHAT_ID,
  MESSAGE_CREATE,
} from "../constants/messageConstants";
import { GLOBAL_ALERT } from "../constants/globalConstants";

const getMessageByChatId =
  (authCookie, req, id) => async (dispatch) => {
    try {
      const { origin } = absoluteUrl(req);

      dispatch({ type: MESSAGE_LOADING, payload: true });

      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: authCookie,
        },

        params: { messagePageNumber: 1 },
      };

      const { data } = await axios.get(
        `${origin}/api/messages/${id}`,
        config,
      );

      dispatch({ type: MESSAGE_LOADING, payload: false });

      dispatch({ type: MESSAGES_BY_CHAT_ID, payload: data });
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

const createMessage =
  (content, chatId) => async (dispatch, getState) => {
    try {
      const { authReducer } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "/",
          "Cache-Control": "no-cache",
          Cookie: authReducer.token,
        },
        credentials: "same-origin",
      };
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `/api/messages`,
        { content, chatId },
        config,
      );

      dispatch({ type: MESSAGE_CREATE, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      //   if (message === "Not authorized, token failed") {
      //     dispatch(logout());
      //   }
      dispatch({
        type: GLOBAL_ALERT,
        payload: message,
      });
    }
  };

const markMessageAsRead = (chatId) => async (dispatch) => {
  try {
    await axios.put(`/api/messages/${chatId}/markAsRead`, {
      headers: { Authorization: cookie.get("token") },
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    //   if (message === "Not authorized, token failed") {
    //     dispatch(logout());
    //   }
    dispatch({
      type: GLOBAL_ALERT,
      payload: message,
    });
  }
};

export { getMessageByChatId, createMessage, markMessageAsRead };
