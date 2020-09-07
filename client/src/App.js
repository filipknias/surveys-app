import React from "react";
// Styles
import "./scss/main.css";
// Components
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="container">
      <Navbar />
      <h1>Main Content</h1>
    </div>
  );
}

export default App;
