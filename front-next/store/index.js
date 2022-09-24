import React, { createContext, useContext, useMemo, useState } from "react";

export const AppContext = createContext();

const initialState = {
  trades: [],
  token: "",
  password: "",
  rate: 1,
  rates: {}
};

//Provider
export const AppContextProvider = ({ children }) => {
  console.log('regenerando el contexto')
  const [state, dispatch] = useState(initialState);

  const values = useMemo(() => (
    {
      state,      // States que seran visibles en el contexto.
      dispatch: (newState) => dispatch({...state, ...newState}),   // Funciones que son exportadas para manejo externo.
    }), [
    state
  ]);   // States que serán visibles en el contexto.

  // Interface donde será expuesto como proveedor y envolverá la App.
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}


export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    console.error('Error deploying App Context!!!');
  }

  return context;
}

export default useAppContext;
