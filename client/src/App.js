import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
  return (
    <Router>
      <Container fluid className="p-0">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/create" component={CreateSurvey} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
