import React from "react";
import { Route, Redirect } from "react-router-dom";

function AuthRoute({ component: Component, auth, ...props }) {
  return (
    <Route
      {...props}
      render={(props) =>
        auth === true ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
