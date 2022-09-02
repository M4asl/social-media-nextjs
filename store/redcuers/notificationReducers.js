import { NOTIFICATION_LIST_BY_USER } from "../constants/notificationConstants";

const initialState = {
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_LIST_BY_USER:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
};

export default notificationReducer;
