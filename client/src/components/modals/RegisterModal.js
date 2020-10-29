import React, { useState, useRef, useContext } from "react";
import axios from "axios";
// Bootstrap
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
// Images
import RegisterImage from "../../components/img/register-image.svg";
import { UserContext } from "../../context/UserContext";
// Reducers Types
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  START_LOADING,
  STOP_LOADING,
} from "../../reducers/types";

export default function RegisterModal() {
  // Refs
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // State
  const [open, setOpen] = useState(false);
  // Context State
  const [userState, dispatch] = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: START_LOADING });
    axios
      .post("/api/users/register", {
        displayName: displayNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      })
      .then((res) => {
        setOpen(false);
        // Set token
        axios.defaults.headers.common["auth-token"] = res.data.token;
        localStorage.setItem("auth-token", res.data.token);
        // Set user
        dispatch({
          type: SET_USER,
          payload: res.data.user,
        });
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: {
            displayName: null,
            email: null,
            password: null,
          },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        // Set errors
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data.errors,
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  };

  return (
    <>
      <Button variant="danger" type="button" onClick={() => setOpen(true)}>
        Join Now
      </Button>
      <Modal
        show={open}
        onShow={() =>
          dispatch({
            type: CLEAR_ERRORS,
            payload: { displayName: null, email: null, password: null },
          })
        }
        onHide={() => setOpen(false)}
      >
        <Modal.Header className="flex-column">
          <Image
            src={RegisterImage}
            height="200"
            className="mx-auto my-3 d-block"
          />
          <Modal.Title className="w-100 text-center" as="h2">
            Create new account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="display-name">Display Name</Form.Label>
              <Form.Control
                isInvalid={userState.errors.displayName}
                type="text"
                id="display-name"
                placeholder="Your name..."
                ref={displayNameRef}
                required
              />
              {userState.errors.displayName && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.displayName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="email">Email address</Form.Label>
              <Form.Control
                isInvalid={userState.errors.email}
                type="email"
                id="email"
                placeholder="Your email..."
                ref={emailRef}
                required
              />
              {userState.errors.email && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                isInvalid={userState.errors.password}
                type="password"
                id="password"
                placeholder="Your password..."
                ref={passwordRef}
                required
              />
              {userState.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="confirm-password">
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                id="confirm-password"
                placeholder="Confirm password..."
                ref={confirmPasswordRef}
                required
              />
            </Form.Group>

            <div className="d-flex mt-4 mb-3">
              <Button
                type="submit"
                variant="primary"
                disabled={userState.loading ? true : false}
              >
                {userState.loading ? (
                  <Spinner animation="border" />
                ) : (
                  <span>Sign Up</span>
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
