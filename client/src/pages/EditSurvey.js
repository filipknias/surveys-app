import React, { useEffect, useContext } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
// Components
import CreateSurveyForm from "../components/forms/CreateSurveyForm";
import Error from "../components/Error";
import AuthError from "../components/AuthError";
// Context
import { UserContext } from "../context/UserContext";
import { FormContext } from "../context/FormContext";
// Reducer types
import {
  SET_VALUES,
  RESET_VALUES,
  START_LOADING,
  STOP_LOADING,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../reducers/types";

export default function EditSurvey(props) {
  // Context
  const [userState] = useContext(UserContext);
  const [formState, dispatch] = useContext(FormContext);

  const surveyId = props.match.params.surveyId;

  // Fetch survey with given id and set expiration date state
  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    // Start loading
    dispatch({ type: START_LOADING });
    axios
      .get(`/api/surveys/get/${surveyId}`, {
        cancelToken: cancelTokenSource.token,
      })
      .then((res) => {
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: { general: null },
        });

        // Destructuring fetched response
        const {
          title,
          status,
          expirationDate,
          multipleAnswers,
          answers,
        } = res.data;

        // Survey data
        const surveyData = {
          title,
          status,
          multipleAnswers,
          answers: [...answers],
        };

        // Description
        if (res.data.description) {
          surveyData.description = res.data.description;
        }

        // Expiration Date
        if (expirationDate) {
          const date = new Date(expirationDate);

          const formattedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
          );

          const expirationDateObj = {
            formattedDate,
            date: formattedDate.toISOString().split("T")[0],
            hour: formattedDate.getHours(),
            minute: formattedDate.getMinutes(),
          };

          surveyData.expirationDate = expirationDateObj;
        }

        // Set survey values in formState
        dispatch({
          type: SET_VALUES,
          payload: surveyData,
        });

        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        // Set error
        dispatch({
          type: SET_ERRORS,
          payload: { general: err.response.data.error },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  // Submit edited survey
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
    const formattedAnswers = filledAnswers.map((answer) => {
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
      .put(`/api/surveys/${surveyId}`, newSurveyData)
      .then((res) => {
        // Reset values
        dispatch({ type: RESET_VALUES });
        // Clear errors
        dispatch({
          type: CLEAR_ERRORS,
          payload: { general: null },
        });
        // Redirect to survey vote page
        props.history.push(`/surveys/${res.data._id}/vote`);
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
                Edit <span className="green-text">your survey</span>
              </Card.Header>
              <Card.Body className="px-md-5">
                <CreateSurveyForm
                  history={props.history}
                  handleSubmit={handleSubmit}
                />
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </>
  );
}
