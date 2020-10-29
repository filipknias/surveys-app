import React, { useState, useRef, useContext } from "react";
import axios from "axios";
// Bootstrap
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
// Images
import EditProfileIcon from "../img/editprofile-icon.svg";
import EditProfileImage from "../img/editprofile-image.svg";
// Context
import { UserContext } from "../../context/UserContext";
// Reducer types
import {
  START_LOADING,
  STOP_LOADING,
  CLEAR_ERRORS,
  SET_USER,
  SET_ERRORS,
} from "../../reducers/types";

export default function EditProfileModal() {
  // State
  const [open, setOpen] = useState(false);
  // Refs
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // Context
  const [userState, dispatch] = useContext(UserContext);

  // Submit edited user
  const handleSubmit = (e) => {
    e.preventDefault();

    // Edited values
    const displayNameValue = displayNameRef.current.value;
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;
    const confirmPasswordValue = confirmPasswordRef.current.value;

    const editedProfileData = {};

    // Check if edited values exist
    if (displayNameValue.trim() !== "") {
      editedProfileData.displayName = displayNameValue;
    }
    if (emailValue.trim() !== "") {
      editedProfileData.email = emailValue;
    }
    if (passwordValue.trim() !== "") {
      editedProfileData.password = passwordValue;
    }
    if (confirmPasswordValue.trim() !== "") {
      editedProfileData.confirmPassword = confirmPasswordValue;
    }

    // Check if any value exists
    if (Object.keys(editedProfileData).length === 0) return;

    // Start loading
    dispatch({ type: START_LOADING });

    axios
      .put(`/api/users/${userState.user._id}`, editedProfileData)
      .then((res) => {
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: {
            displayName: null,
            email: null,
            password: null,
            general: null,
          },
        });
        // Set user
        dispatch({
          type: SET_USER,
          payload: res.data,
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
        // Close modal
        setOpen(false);
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
      <div className="d-flex align-items-center" onClick={() => setOpen(true)}>
        <Image src={EditProfileIcon} height="20" className="mr-2" />
        <p>Edit Profile</p>
      </div>
      <Modal
        show={open}
        onHide={() => setOpen(false)}
        onShow={() =>
          dispatch({
            type: CLEAR_ERRORS,
            payload: { displayName: null, email: null, password: null },
          })
        }
      >
        <Modal.Header className="flex-column">
          <Image
            src={EditProfileImage}
            height="150"
            className="mx-auto my-3 d-block"
          />
          <Modal.Title className="w-100 text-center" as="h3">
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        {userState.errors.general && (
          <Alert variant="danger">{userState.errors.general}</Alert>
        )}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="displayName">Display Name</Form.Label>
              <Form.Control
                isInvalid={userState.errors.displayName}
                type="text"
                id="displayName"
                placeholder="Keep blank if the same"
                ref={displayNameRef}
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
                placeholder="Keep blank if the same"
                ref={emailRef}
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
                placeholder="Keep blank if the same"
                ref={passwordRef}
              />
              {userState.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {userState.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                id="confirmPassword"
                placeholder="Keep blank if the same"
                ref={confirmPasswordRef}
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
                  <span>Edit</span>
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
