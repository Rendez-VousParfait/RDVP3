import React, { createContext, useReducer, useContext, useEffect } from "react";
import moment from "moment";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const AppContext = createContext();

const initialState = {
  user: null,
  formData: {
    typologie: "",
    dates: { debut: "", fin: "" },
    personnalisation: {},
    preferencesResto: {},
    preferencesHebergement: {},
    preferencesActivites: {},
    results: [],
  },
  currentStep: 1,
  error: null,
  loading: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "UPDATE_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
          dates: action.payload.dates
            ? {
                debut: moment(action.payload.dates[0]).format("YYYY-MM-DD"),
                fin: moment(action.payload.dates[1]).format("YYYY-MM-DD"),
              }
            : state.formData.dates,
        },
      };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET_FORM":
      return { ...state, formData: initialState.formData, currentStep: 1 };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export default AppContext;