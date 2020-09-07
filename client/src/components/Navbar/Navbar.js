import React, { useState, useEffect } from "react";
// Components
import Dropdown from "./Dropdown";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const user = "pawel";

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">
        mySurveys<span className="green-text">.com</span>
      </h1>
      <ul className={open ? "navbar-nav open" : "navbar-nav"}>
        <li className="nav-item">Home</li>
        <li className="nav-item">Explore</li>
        <li className="nav-item">
          <div className="btn btn-danger">Create survey</div>
        </li>

        {user ? (
          <li className="nav-item" onClick={() => setDropdown(!dropdown)}>
            {user}
            <i className="fa fa-caret-down"></i>
            {dropdown && <Dropdown open={dropdown} />}
          </li>
        ) : (
          <div className="btn btn-primary">Sign in</div>
        )}
      </ul>
      <button
        type="button"
        className="btn btn-dark menu-btn"
        onClick={handleClick}
      >
        <i className={open ? "fa fa-times" : "fa fa-bars"}></i>
      </button>
    </nav>
  );
}

export default Navbar;
