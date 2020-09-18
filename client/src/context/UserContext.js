import React, { createContext, useState } from "react";

const initialState = {
  isAuth: false,
  user: {},
};
export const UserContext = createContext([initialState, () => {}]);

export const UserProvider = (props) => {
  const [userState, setUserState] = useState({
    isAuth: false,
    user: {},
  });
  return (
    <UserContext.Provider value={[userState, setUserState]}>
      {props.children}
    </UserContext.Provider>
  );
};
