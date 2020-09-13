import React from "react";
import { Route, Redirect } from "react-router-dom";

function NotAuthRoute({ component: Component, auth, ...props }) {
  return (
    <Route
      {...props}
      render={(props) =>
        auth === false ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
}

export default NotAuthRoute;
