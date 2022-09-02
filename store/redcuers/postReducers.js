import { DeleteData, EditData } from "../actions/globalActions";
import {
  NO_MORE_DATA,
  POST_CREATE,
  POST_LIST_BY_USER,
  POST_LIST_NEWS_FEED,
  POST_LOADING,
  POST_REMOVE,
  POST_UPDATE,
  UPDATE_POSTS_SCROLL,
} from "../constants/postConstants";

const initialState = {
  loading: false,
  posts: [],
  noMoreData: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LIST_NEWS_FEED:
      return {
        ...state,
        posts: action.payload,
      };
    case POST_LIST_BY_USER:
      return {
        ...state,
        posts: action.payload,
      };
    case POST_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case POST_CREATE:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POST_UPDATE:
      return {
        ...state,
        posts: EditData(
          state.posts,
          action.payload._id,
          action.payload,
        ),
      };
    case POST_REMOVE:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload),
      };
    case UPDATE_POSTS_SCROLL:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
      };
    case NO_MORE_DATA:
      return {
        ...state,
        noMoreData: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
