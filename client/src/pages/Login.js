import React from "react";
import { Link } from "react-router-dom";
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

function Login() {
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
          <Form>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Your email..." required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your password..."
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
