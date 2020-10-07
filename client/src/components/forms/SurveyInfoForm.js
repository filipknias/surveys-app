import React, { useContext, useEffect } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
// Context
import { UserContext } from "../../context/UserContext";
import { FormContext } from "../../context/FormContext";
// Reducer Types
import {
  SET_VALUES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_VALID,
  SET_INVALID,
} from "../../reducers/types";

export default function SurveyInfoForm() {
  // Context state
  const [userState] = useContext(UserContext);
  const [formState, dispatch] = useContext(FormContext);

  // Constants
  const MIN_TITLE_LENGTH = 5;
  const MAX_TITLE_LENGTH = 50;
  const MIN_DESCRIPTION_LENGTH = 10;
  const MAX_DESCRIPTION_LENGTH = 70;

  const titleValidation = () => {
    const {
      values: { title },
    } = formState;
    let error = null;

    if (
      title.trim().length < MIN_TITLE_LENGTH ||
      title.trim().length > MAX_TITLE_LENGTH
    ) {
      error = `Title length must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.`;
    }
    if (title === "") {
      error = "Title must not be empty.";
    }

    return error;
  };

  const descriptionValidation = () => {
    const {
      values: { description },
    } = formState;
    let error = null;

    if (
      description.trim().length < MIN_DESCRIPTION_LENGTH ||
      description.trim().length > MAX_DESCRIPTION_LENGTH
    ) {
      error = `Description length must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters.`;
    }
    if (description === "") {
      error = null;
    }

    return error;
  };

  // Title and description validation check
  useEffect(() => {
    // TITLE VALIDATION
    const titleValidationError = titleValidation();
    if (titleValidationError) {
      // Set Title Error
      dispatch({
        type: SET_ERRORS,
        payload: { title: titleValidationError },
      });
    } else {
      // Clear Title Error
      dispatch({
        type: CLEAR_ERRORS,
        payload: { title: null },
      });
    }

    // DESCRIPTION VALIDATION
    const descriptionValidationError = descriptionValidation();
    if (descriptionValidationError) {
      // Set Description Error
      dispatch({
        type: SET_ERRORS,
        payload: {
          description: descriptionValidationError,
        },
      });
    } else {
      // Clear Description Error
      dispatch({
        type: CLEAR_ERRORS,
        payload: { description: null },
      });
    }
  }, [formState.values.title, formState.values.description]);

  // Error values check
  useEffect(() => {
    const {
      errors: { title, description },
    } = formState;
    // Check if there is any error
    if (!title && !description) {
      dispatch({ type: SET_VALID });
    } else {
      dispatch({ type: SET_INVALID });
    }
  }, [formState.errors.title, formState.errors.description]);

  const handleTitleChange = (e) => {
    e.persist();
    // Set Title Value
    dispatch({
      type: SET_VALUES,
      payload: { title: e.target.value },
    });
  };

  const handleDescriptionChange = (e) => {
    e.persist();
    // Set Description Value
    dispatch({
      type: SET_VALUES,
      payload: { description: e.target.value },
    });
  };

  return (
    <>
      <Form.Group>
        <Form.Label htmlFor="survey-title">Title</Form.Label>
        <Form.Control
          isInvalid={formState.errors && formState.errors.title}
          type="text"
          id="survey-title"
          placeholder="Survey title..."
          value={formState.values.title}
          onChange={(e) => handleTitleChange(e)}
          disabled={userState.isAuth ? false : true}
          required
        />
        <Form.Control.Feedback type="invalid">
          {formState.errors.title}
        </Form.Control.Feedback>
        <Form.Text className="text-muted ml-1">
          {formState.values.title.length}/{MAX_TITLE_LENGTH}
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="description">Description (optional)</Form.Label>
        <Form.Control
          isInvalid={formState.errors && formState.errors.description}
          as="textarea"
          rows="5"
          id="description"
          value={formState.values.description}
          onChange={(e) => handleDescriptionChange(e)}
          disabled={userState.isAuth ? false : true}
          placeholder="Survey description..."
        />
        <Form.Control.Feedback type="invalid">
          {formState.errors.description}
        </Form.Control.Feedback>
        <Form.Text className="text-muted ml-1">
          {formState.values.description.length}/{MAX_DESCRIPTION_LENGTH}
        </Form.Text>
      </Form.Group>
    </>
  );
}
