import {
  USER_LIST,
  USER_EDIT_PROFILE,
  USER_DELETE,
  USER_FIND_PEOPLE,
  USER_FOLLOW,
  USER_UNFOLLOW,
  USER_LOADING,
  USER_DETAILS,
  CURRENT_USER_PROFILE_DETAILS,
  UPDATE_CURRENT_USER_FOLLOWING_FOLLOW,
  UPDATE_CURRENT_USER_FOLLOWING_UNFOLLOW,
} from "../constants/userConstants";
import { DeleteData } from "../actions/globalActions";

const initialState = {
  loading: false,
  users: [],
  usersToFollow: [],
  user: {},
  currentUserDetails: { following: [] },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CURRENT_USER_PROFILE_DETAILS:
      return {
        ...state,
        currentUserDetails: action.payload,
      };
    case USER_LIST:
      return {
        ...state,
        users: action.payload,
      };
    case USER_DETAILS:
      return {
        ...state,
        user: action.payload,
      };
    case USER_FIND_PEOPLE:
      return {
        ...state,
        usersToFollow: action.payload,
      };
    case USER_EDIT_PROFILE:
      return {
        ...state,
        currentUserDetails: action.payload,
      };
    case USER_DELETE:
      return {
        ...state,
        userInfo: {},
      };
    case USER_FOLLOW:
      return {
        ...state,
        user: action.payload,
      };
    case USER_UNFOLLOW:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_CURRENT_USER_FOLLOWING_FOLLOW:
      return {
        ...state,
        currentUserDetails: {
          ...state.currentUserDetails,
          following: [
            action.payload,
            ...state.currentUserDetails.following,
          ],
        },
        usersToFollow: DeleteData(
          state.usersToFollow,
          action.payload,
        ),
      };
    case UPDATE_CURRENT_USER_FOLLOWING_UNFOLLOW:
      return {
        ...state,
        currentUserDetails: {
          ...state.currentUserDetails,
          following: state.currentUserDetails.following.filter(
            (follow) => follow !== action.payload,
          ),
        },
      };
    default:
      return state;
  }
};

export default userReducer;
