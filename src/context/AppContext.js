import React, { createContext, useReducer } from "react";

const initialState = {
  userGroups: null,
  isLoading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER_GROUPS":
      return { ...state, userGroups: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}