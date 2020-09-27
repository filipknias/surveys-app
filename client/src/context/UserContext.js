import React, { createContext, useReducer } from "react";
import UserReducer from "../reducers/UserReducer";

const initialState = {
  isAuth: false,
  user: {},
  errors: {},
  loading: false,
};
export const UserContext = createContext([initialState, () => {}]);

export const UserProvider = (props) => {
  const [userState, dispatch] = useReducer(UserReducer, initialState);
  return (
    <UserContext.Provider value={[userState, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};
