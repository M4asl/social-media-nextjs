import {
  MESSAGE_LOADING,
  MESSAGES_BY_CHAT_ID,
  MESSAGE_CREATE,
  UPDATE_MESSAGES,
} from "../constants/messageConstants";

const initialState = {
  loading: false,
  messages: [],
  message: {},
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case MESSAGES_BY_CHAT_ID:
      return {
        ...state,
        messages: action.payload,
      };
    case MESSAGE_CREATE:
      return {
        ...state,
        message: action.payload,
      };
    case UPDATE_MESSAGES:
      return {
        ...state,
        messages: [action.payload, ...state.messages],
      };
    default:
      return state;
  }
};

export default messageReducer;
