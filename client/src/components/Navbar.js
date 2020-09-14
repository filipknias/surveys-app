import React, { useState } from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
// Components
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
// Images
import ProfileIcon from "./img/profile-icon.svg";
import AccountDropdownIcon from "./img/account-dropdown-icon.svg";
import LogoutDropdownIcon from "./img/logout-dropdown-icon.svg";

function NavbarComponent() {
  const auth = false;
  const user = {
    displayName: "johny",
    email: "johny@gmail.com",
  };

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
          <Nav.Item onClick={() => setOpen(false)}>
            <Link to="/">Home</Link>
          </Nav.Item>
          <Nav.Item onClick={() => setOpen(false)}>
            <Link to="/explore">Explore</Link>
          </Nav.Item>
          {auth ? (
            <>
              <Nav.Item onClick={() => setOpen(false)}>
                <Link to="/create">
                  <Button variant="danger">Create Survey</Button>
                </Link>
              </Nav.Item>
              <NavDropdown title={user.displayName} alignRight>
                <Image
                  src={ProfileIcon}
                  height="60"
                  className="d-block ml-auto mr-auto mt-1"
                />
                <h3 className="text-center mt-1 mb-0 px-2">
                  {user.displayName}
                </h3>
                <p className="text-muted text-center px-2">{user.email}</p>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Image
                    src={AccountDropdownIcon}
                    height="20"
                    className="mr-2"
                  />
                  Account
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Image
                    src={LogoutDropdownIcon}
                    height="20"
                    className="mr-2"
                  />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <>
              <Nav.Item onClick={() => setOpen(false)}>
                <RegisterModal />
              </Nav.Item>
              <Nav.Item onClick={() => setOpen(false)}>
                <LoginModal />
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
