import { combineReducers } from "redux";
import authReducer from "./authReducers";
import userReducer from "./userReducers";
import postReducer from "./postReducers";
import chatReducer from "./chatReducers";
import messageReducer from "./messageReducers";
import notificationReducer from "./notificationReducers";
import alert from "./alertReducers";

const reducer = combineReducers({
  alert,
  authReducer,
  userReducer,
  postReducer,
  chatReducer,
  messageReducer,
  notificationReducer,
});

export default reducer;
