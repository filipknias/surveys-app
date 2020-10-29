import React, { useContext, useEffect } from "react";
import axios from "axios";
// Components
import CreateSurveyForm from "../components/forms/CreateSurveyForm";
import Error from "../components/Error";
import AuthError from "../components/AuthError";
// Bootstrap
import Card from "react-bootstrap/Card";
// Context
import { UserContext } from "../context/UserContext";
import { FormContext } from "../context/FormContext";
// Reducer types
import {
  RESET_VALUES,
  START_LOADING,
  STOP_LOADING,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../reducers/types";

export default function CreateSurvey({ history }) {
  // Context
  const [userState] = useContext(UserContext);
  const [formState, dispatch] = useContext(FormContext);

  // Reset values
  useEffect(() => {
    dispatch({ type: RESET_VALUES });
  }, []);

  // Submit survey
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent submit on prev steps
    if (formState.currentStep !== formState.steps.length) return;

    // Start loading
    dispatch({ type: START_LOADING });

    const { values } = formState;
    // Format answers
    const filledAnswers = values.answers.filter((answer) => {
      return answer.value.trim().length > 0;
    });
    const formattedAnswers = filledAnswers.map((answer, index) => {
      return {
        ...answer,
        value: answer.value.trim(),
      };
    });

    // New Survey Data
    const newSurveyData = {
      title: values.title,
      description: values.description,
      answers: formattedAnswers,
      status: values.status,
      multipleAnswers: values.multipleAnswers,
    };

    // Set expiration date
    if (values.expirationDate.date !== null) {
      newSurveyData.expirationDate = values.expirationDate.formattedDate;
    }

    // Send survey
    axios
      .post("/api/surveys/create", newSurveyData)
      .then((res) => {
        // Reset values
        dispatch({ type: RESET_VALUES });
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: { general: null },
        });
        // Redirect to survey vote page
        history.push(`/surveys/${res.data._id}/vote`);
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: { general: err.response.data.error },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  };

  return (
    <>
      {formState.errors.general ? (
        <Error message={formState.errors.general} />
      ) : (
        <>
          {!userState.isAuth ? (
            <AuthError />
          ) : (
            <Card border="dark">
              <Card.Header className="text-center" as="h5">
                Create your own{" "}
                <span className="green-text">custom survey</span>
              </Card.Header>
              <Card.Body className="px-md-5">
                <CreateSurveyForm handleSubmit={handleSubmit} />
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </>
  );
}
