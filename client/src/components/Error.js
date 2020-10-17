import React from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function Error({ message }) {
  return (
    <Alert variant="danger">
      <Alert.Heading>Something went wrong...</Alert.Heading>
      <p>{message}</p>
      <hr />
      <Link to="/" className="d-inline">
        <Button variant="outline-danger" className="px-5">
          Close
        </Button>
      </Link>
      <Button 
        variant="outline-danger"
        className="px-5 ml-4"
        onClick={() => document.location.reload()}
      >
        Refresh
      </Button>
    </Alert>
  );
}
