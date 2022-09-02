import axios from "axios";
import absoluteUrl from "next-absolute-url";
import { NOTIFICATION_LIST_BY_USER } from "../constants/notificationConstants";
import { GLOBAL_ALERT } from "../constants/globalConstants";

const getNotificationByUser =
  (authCookie, req) => async (dispatch) => {
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
        `${origin}/api/notifications`,
        config,
      );

      dispatch({ type: NOTIFICATION_LIST_BY_USER, payload: data });
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

export default getNotificationByUser;
