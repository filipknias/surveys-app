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
import VoteSurvey from "./pages/VoteSurvey";
import ResultsSurvey from "./pages/ResultsSurvey";
import Profile from "./pages/Profile";
// Context
import { UserProvider } from "./context/UserContext";
import { FormProvider } from "./context/FormContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Container className="my-5">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/surveys/:surveyId/vote" component={VoteSurvey} />
            <Route
              path="/surveys/:surveyId/results"
              component={ResultsSurvey}
            />
            <Route path="/users/:userId" component={Profile} />
            <FormProvider>
              <Route path="/create" component={CreateSurvey} />
            </FormProvider>
          </Switch>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
