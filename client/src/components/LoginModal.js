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
import LoginImage from "../components/img/login-image.svg";
// Context
import { UserContext } from "../context/UserContext";

function LoginModal() {
  // Refs
  const emailRef = useRef();
  const passwordRef = useRef();
  // State
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Context State
  const [userState, setUserState] = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/users/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((res) => {
        axios.defaults.headers.common["auth-token"] = res.data.token;
        localStorage.setItem("auth-token", res.data.token);
        setOpen(false);
        setUserState({
          isAuth: true,
          user: res.data.user,
        });
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.errors);
        setLoading(false);
      });
  };

  return (
    <>
      <Button variant="primary" type="button" onClick={() => setOpen(true)}>
        Sign In
      </Button>
      <Modal
        show={open}
        onShow={() => setError(null)}
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
        {error && error.general && (
          <Alert variant="danger">{error.general}</Alert>
        )}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                isInvalid={error && error.email ? true : false}
                type="email"
                placeholder="Your email..."
                name="email"
                ref={emailRef}
                required
              />
              {error && error.email && (
                <Form.Control.Feedback type="invalid">
                  {error.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={error && error.password ? true : false}
                type="password"
                placeholder="Your password..."
                name="password"
                ref={passwordRef}
                required
              />
              {error && error.password && (
                <Form.Control.Feedback type="invalid">
                  {error.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="mt-4 mb-3">
              <Button type="submit" variant="primary">
                {loading ? (
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
