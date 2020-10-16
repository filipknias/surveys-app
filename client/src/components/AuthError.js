import React from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function AuthError() {
    return (
        <Alert variant="danger">
            <Alert.Heading>Sign in to view this page!</Alert.Heading>
            <p>
            To be able view this page you need to create a free account
            or sign in by clicking on the navbar button.
            </p>
            <hr />
            <Link to="/" className="d-inline">
                <Button variant="outline-danger" className="px-5">
                    Close
                </Button>
            </Link>
        </Alert>
    )
}
