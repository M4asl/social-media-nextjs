import { createStore, applyMiddleware } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import reducers from "./redcuers/redcuers";

const bindMiddlware = (middlware) => {
  if (process.env.NODE_ENV !== "production") {
    const {
      composeWithDevTools,
    } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middlware));
  }

  return applyMiddleware(...middlware);
};

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  }
  return reducers(state, action);
};

const initStore = () =>
  createStore(reducer, bindMiddlware([thunkMiddleware]));

export const wrapper = createWrapper(initStore);
