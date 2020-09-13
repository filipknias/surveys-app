import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import NotAuthRoute from "./NotAuthRoute";
import axios from "axios";
// Styles
import "./App.css";
// Bootstrap
import Container from "react-bootstrap/Container";
// Components
import Navbar from "./components/Navbar";
// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateSurvey from "./pages/CreateSurvey";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const auth = false;

  return (
    <Router>
      <Navbar />
      <Container className="p-0">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <NotAuthRoute path="/create" component={CreateSurvey} auth={auth} />
          <AuthRoute path="/register" component={Register} auth={auth} />
          <AuthRoute path="/login" component={Login} auth={auth} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
