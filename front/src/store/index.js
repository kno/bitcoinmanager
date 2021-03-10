import React, { createContext, useReducer } from "react";
import reducer from "./reducers";

export const Context = createContext();

const initialState = {
  trades: [],
  token: "",
  password: "",
  rate: 1,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default Store;
