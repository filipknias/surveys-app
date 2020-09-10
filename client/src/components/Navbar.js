import React, { useState } from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
// Images
import ProfileIcon from "./img/profile-icon.svg";

function NavbarComponent() {
  const user = null;

  const [open, setOpen] = useState(false);

  return (
    <Navbar expand="md" bg="light" expanded={open}>
      <Navbar.Brand onClick={() => setOpen(false)}>
        <Link to="/">
          mySurveys<span className="green-text">.com</span>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        onClick={() => setOpen(!open)}
      />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link onClick={() => setOpen(false)}>
            <Link to="/">Home</Link>
          </Nav.Link>
          <Nav.Link onClick={() => setOpen(false)}>
            <Link to="/explore">Explore</Link>
          </Nav.Link>
          <Nav.Link onClick={() => setOpen(false)}>
            <Link to="/create">
              <Button variant="danger">Create Survey</Button>
            </Link>
          </Nav.Link>
          {user ? (
            <NavDropdown title={user.displayName} alignRight>
              <Image
                src={ProfileIcon}
                height="60"
                className="d-block ml-auto mr-auto mt-1"
              />
              <h3 className="text-center mt-1 mb-0 px-2">{user.displayName}</h3>
              <p className="text-muted text-center px-2">{user.email}</p>
              <NavDropdown.Divider />
              <NavDropdown.Item>Account</NavDropdown.Item>
              <NavDropdown.Item>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link onClick={() => setOpen(false)}>
              <Link to="/login">
                <Button variant="primary">Sign in</Button>
              </Link>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
