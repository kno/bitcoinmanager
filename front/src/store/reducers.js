import { FETCH_TRADES, SET_USER_DATA, UPDATE_RATE } from "./actions";

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_TRADES:
      return {
        ...state,
        trades: action.payload || [],
      };
    case UPDATE_RATE:
      return {
        ...state,
        rate: action.payload || 1,
      };
    case SET_USER_DATA:
      return {
        ...state,
        password: action.payload.password,
        token : action.payload.token
      }
    default:
      return state;
  }
};

export default reducer;
