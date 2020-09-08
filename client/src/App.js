import React from "react";
// Styles
// import "./scss/main.css";
// Bootstrap
import Container from "react-bootstrap/Container";
// Components
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <Container>
      <Navbar />
      <h1>Main Content</h1>
    </Container>
  );
}

export default App;
