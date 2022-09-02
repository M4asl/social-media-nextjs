import {
  USER_LOGOUT,
  AUTHENTICATE,
  USER_LOADING_ACTION,
} from "../constants/authConstants";

const initialState = {
  loading: false,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING_ACTION:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTHENTICATE:
      return {
        ...state,
        token: action.payload,
      };
    case USER_LOGOUT:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;
