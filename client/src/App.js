import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Styles
import "./App.css";
// Bootstrap
import Container from "react-bootstrap/Container";
// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./components/AuthRoute";
// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateSurvey from "./pages/CreateSurvey";

function App() {
  const auth = false;

  return (
    <Router>
      <Navbar />
      <Container className="p-0">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <AuthRoute path="/create" component={CreateSurvey} auth={auth} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
