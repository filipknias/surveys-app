import React, { useState, useRef } from "react";
import axios from "axios";
// Bootstrap
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
// Images
import RegisterImage from "../components/img/register-image.svg";

function RegisterModal() {
  // Refs
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // State
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/users/register", {
        displayName: displayNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      })
      .then((res) => {
        axios.defaults.headers.common["auth-token"] = res.data.token;
        setError(null);
        setOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.errors);
        setLoading(false);
      });
  };

  return (
    <>
      <Button variant="danger" type="button" onClick={() => setOpen(true)}>
        Join Now
      </Button>
      <Modal
        show={open}
        onShow={() => setError(null)}
        onHide={() => setOpen(false)}
      >
        <Modal.Header className="flex-column">
          <Image
            src={RegisterImage}
            height="200"
            className="mx-auto my-3 d-block"
          />
          <Modal.Title className="w-100 text-center">
            <h2>Create new account</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                isInvalid={error && error.displayName ? true : false}
                type="text"
                placeholder="Your name..."
                name="displayName"
                ref={displayNameRef}
                required
              />
              {error && error.displayName && (
                <Form.Control.Feedback type="invalid">
                  {error.displayName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password..."
                name="confirmPassword"
                ref={confirmPasswordRef}
                required
              />
            </Form.Group>

            <div className="mt-4 mb-3">
              <Button type="submit" variant="primary">
                {loading ? (
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

export default RegisterModal;
