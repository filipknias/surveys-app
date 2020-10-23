import React, { useState, useRef, useContext } from "react";
import axios from "axios";
// Bootstrap
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
// Images
import LoginImage from "../../components/img/login-image.svg";
// Context
import { UserContext } from "../../context/UserContext";
// Reducers Types
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  START_LOADING,
  STOP_LOADING,
} from "../../reducers/types";
function LoginModal() {
  // Refs
  const emailRef = useRef();
  const passwordRef = useRef();
  // State
  const [open, setOpen] = useState(false);
  // Context State
  const [userState, dispatch] = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: START_LOADING });
    axios
      .post("/api/users/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((res) => {
        // Set token
        axios.defaults.headers.common["auth-token"] = res.data.token;
        localStorage.setItem("auth-token", res.data.token);
        setOpen(false);
        // Set user
        dispatch({
          type: SET_USER,
          payload: res.data.user,
        });
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: { general: null },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        // Set errors
        dispatch({
          type: SET_ERRORS,
          payload: { general: err.response.data.errors.general },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  };

  return (
    <>
      <Button variant="primary" type="button" onClick={() => setOpen(true)}>
        Sign In
      </Button>
      <Modal
        show={open}
        onShow={() =>
          dispatch({ type: CLEAR_ERRORS, payload: { general: null } })
        }
        onHide={() => setOpen(false)}
      >
        <Modal.Header className="flex-column">
          <Image
            src={LoginImage}
            height="200"
            className="mx-auto my-3 d-block"
          />
          <Modal.Title className="w-100 text-center">
            <h2>Log In to your account</h2>
          </Modal.Title>
        </Modal.Header>
        {userState.errors && userState.errors.general && (
          <Alert variant="danger">{userState.errors.general}</Alert>
        )}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="email">Email address</Form.Label>
              <Form.Control
                isInvalid={userState.errors && userState.errors.email}
                type="email"
                id="email"
                placeholder="Your email..."
                ref={emailRef}
                required
              />
              {userState.errors && userState.errors.email && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                isInvalid={userState.errors && userState.errors.password}
                type="password"
                id="password"
                placeholder="Your password..."
                ref={passwordRef}
                required
              />
              {userState.errors && userState.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="d-flex mt-4 mb-3">
              <Button type="submit" variant="primary">
                {userState.loading ? (
                  <Spinner animation="border" />
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
              <Button
                type="button"
                variant="danger"
                className="ml-3"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;
