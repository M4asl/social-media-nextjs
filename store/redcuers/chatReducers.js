import {
  CHAT_LOADING,
  CHAT_LIST_BY_USER,
  GET_CHAT_BY_ID,
  CREATE_CHAT,
  UPDATE_CHAT,
} from "../constants/chatConstants";
import { editDataChat } from "../actions/globalActions";

const initialState = {
  loading: false,
  chats: [],
  chat: {},
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CHAT_LIST_BY_USER:
      return {
        ...state,
        chats: action.payload,
      };
    case GET_CHAT_BY_ID:
      return {
        ...state,
        chat: action.payload,
      };
    case CREATE_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };
    case UPDATE_CHAT:
      return {
        ...state,
        chats: editDataChat(
          state.chats,
          action.payload.chat._id,
          action.payload,
        ),
      };
    default:
      return state;
  }
};

export default chatReducer;
