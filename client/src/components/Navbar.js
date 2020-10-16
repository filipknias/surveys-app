import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
// Components
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
// Images
import ProfileIcon from "./img/profile-icon.svg";
import AccountDropdownIcon from "./img/account-dropdown-icon.svg";
import LogoutDropdownIcon from "./img/logout-dropdown-icon.svg";
// Context
import { UserContext } from "../context/UserContext";
// Reducer Types
import { SET_USER, CLEAR_USER } from "../reducers/types";

function NavbarComponent() {
  const [open, setOpen] = useState(false);
  const [userState, dispatch] = useContext(UserContext);

  // Check localStorage for user token
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch({ CLEAR_USER });
        localStorage.removeItem("auth-token");
      } else {
        axios.defaults.headers.common["auth-token"] = token;
        axios
          .get(`/api/users/${decodedToken._id}`)
          .then((res) => {
            dispatch({
              type: SET_USER,
              payload: res.data,
            });
          })
          .catch(() => {
            dispatch({ CLEAR_USER });
          });
      }
    }
  }, []);

  const handleLogout = () => {
    setOpen(false);
    dispatch({ type: CLEAR_USER });
    localStorage.removeItem("auth-token");
  };

  return (
    <Navbar expand="md" bg="light" expanded={open} sticky="top">
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
          {userState.isAuth ? (
            <>
              <Nav.Item onClick={() => setOpen(false)}>
                <Link to="/create">
                  <Button variant="danger">Create Survey</Button>
                </Link>
              </Nav.Item>
              <NavDropdown title={userState.user.displayName} alignRight>
                <Image
                  src={ProfileIcon}
                  height="60"
                  className="d-block ml-auto mr-auto mt-1"
                />
                <h4 className="text-center mt-1 mb-0 px-2">
                  {userState.user.displayName}
                </h4>
                <p className="text-muted text-center px-2">
                  {userState.user.email}
                </p>
                <NavDropdown.Divider />
                <Link to={`/users/${userState.user._id}`} onClick={() => setOpen(false)}>
                  <NavDropdown.Item as="div">
                      <Image
                        src={AccountDropdownIcon}
                        height="20"
                        className="mr-2"
                      />
                      Account
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Item onClick={handleLogout}>
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
