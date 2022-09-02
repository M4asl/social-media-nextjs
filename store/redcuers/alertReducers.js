import { GLOBAL_ALERT } from "../constants/globalConstants";

const initialState = {
  error: [],
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_ALERT:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default alertReducer;
