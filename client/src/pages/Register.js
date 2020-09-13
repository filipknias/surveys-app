import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// Images
import RegisterImage from "../components/img/register-image.svg";

function Register({ history }) {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/register", {
        displayName: displayNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      })
      .then((res) => {
        axios.defaults.headers.common["auth-token"] = res.data.token;
        history.push("/");
        setError(null);
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(err.response.data.errors);
      });
  };

  return (
    <Row>
      <Col md={7} className="mx-auto">
        <Card body className="my-5 px-2 py-4" border="dark">
          <Image
            src={RegisterImage}
            height="200"
            className="mx-auto my-3 d-block"
          />
          <h2 className="text-center my-4">Create new account</h2>
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
            <Link to="/login" className="my-2">
              Arleady have an account ? Sign in and get more advantages.
            </Link>
            <Button type="submit" variant="primary" className="mt-3 px-5 py-2">
              Sign Up
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;
