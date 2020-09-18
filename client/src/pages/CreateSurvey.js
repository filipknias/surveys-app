import React, { useEffect, useContext } from "react";
// Context
import { UserContext } from "../context/UserContext";

function CreateSurvey({ history }) {
  const [userState, setUserState] = useContext(UserContext);

  useEffect(() => {
    if (userState.isAuth === false) {
      console.log("You are not logged in!");
      history.push("/");
    } else {
      console.log("You are logged in!");
    }
  }, []);

  const logout = () => {
    setUserState((state) => ({
      ...state,
      isAuth: false,
      user: {},
    }));
  };

  return (
    <div>
      <h1>Create Survey</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default CreateSurvey;
