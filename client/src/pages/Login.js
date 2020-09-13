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
import Alert from "react-bootstrap/Alert";
// Images
import LoginImage from "../components/img/login-image.svg";

function Login({ history }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((res) => {
        axios.defaults.headers.common["auth-token"] = res.data.token;
        history.push("/");
        setError(null);
      })
      .catch((err) => {
        setError(err.response.data.errors.general);
      });
  };

  return (
    <Row>
      <Col md={7} className="mx-auto">
        <Card body className="my-5 px-2 py-4" border="dark">
          <Image
            src={LoginImage}
            height="200"
            className="mx-auto my-3 d-block"
          />
          <h2 className="text-center my-4">Log In to your account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Your email..."
                name="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your password..."
                name="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Link to="/register" className="my-2">
              Don’t have an account ? Sign up and get more advantages.
            </Link>
            <Button type="submit" variant="primary" className="mt-3 px-5 py-2">
              Sign In
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
