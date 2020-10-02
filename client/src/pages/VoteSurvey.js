import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Components
import SurveyHeader from "../components/surveys/SurveyHeader";
import ShareSurveyPopover from "../components/surveys/ShareSurveyPopover";
// Bootstrap
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
// Context
import { SurveyContext } from "../context/SurveyContext";
// Images
import ResultsIcon from "../components/img/results-icon.svg";
// Reducer Types
import {
  SET_VALUES,
  SET_VALID,
  SET_INVALID,
  START_LOADING,
  STOP_LOADING,
} from "../reducers/types";

export default function VoteSurvey(props) {
  // Context
  const [surveyState, dispatch] = useContext(SurveyContext);

  // Set survey
  useEffect(() => {
    // Start loading
    dispatch({ type: START_LOADING });
    const surveyId = props.match.params.surveyId;
    axios
      .get(`/api/surveys/get/${surveyId}`)
      .then((res) => {
        // Set survey
        dispatch({
          type: SET_VALUES,
          payload: { survey: res.data },
        });
        // Set expiration date
        if (res.data.expirationDate) {
          dispatch({
            type: SET_VALUES,
            payload: { expirationDate: res.data.expirationDate },
          });
        }
        // Set answers
        const answersState = res.data.answers.map((answer) => {
          return {
            ...answer,
            checked: false,
          };
        });
        dispatch({
          type: SET_VALUES,
          payload: { answers: answersState },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch(() => {
        props.history.push("/");
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  }, []);

  // Answers validation
  useEffect(() => {
    const checkedAnswers = surveyState.answers.filter((answer) => {
      return answer.checked === true;
    });
    if (checkedAnswers.length < 1) {
      dispatch({ type: SET_INVALID });
    } else {
      dispatch({ type: SET_VALID });
    }
  }, [surveyState.answers]);

  // Submit vote
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get checked answers values
    const checkedAnswers = surveyState.answers.filter((answer) => {
      return answer.checked === true;
    });
    // Format checked array to only values array
    const answersValues = checkedAnswers.map((answer) => {
      return answer.value;
    });

    axios
      .post(`/api/votes/${surveyState.survey._id}`, { answers: answersValues })
      .then(() => {
        props.history.push(`/surveys/${surveyState.survey._id}/results`);
      })
      .catch((err) => {
        dispatch({
          type: SET_VALUES,
          payload: { error: err.response.data },
        });
      });
  };

  // Answers change state update
  const handleAnswerChange = (answerId) => {
    const updatedAnswers = surveyState.answers.map((answer) => {
      if (answer.id === answerId) {
        if (surveyState.survey.multipleAnswers) {
          // Multiple answer
          return {
            ...answer,
            checked: !answer.checked,
          };
        } else {
          // Single answer
          return {
            ...answer,
            checked: true,
          };
        }
      } else {
        if (surveyState.survey.multipleAnswers) {
          // Multiple answer
          return answer;
        } else {
          // Single answer
          return {
            ...answer,
            checked: false,
          };
        }
      }
    });
    dispatch({
      type: SET_VALUES,
      payload: { answers: updatedAnswers },
    });
  };

  return (
    <>
      {surveyState.error && (
        <Alert variant="danger">
          <Alert.Heading>Somethink went wrong...</Alert.Heading>
          <p>{surveyState.error}</p>
        </Alert>
      )}
      <Card border="dark">
        <Card.Header className="text-center">
          <h4 className="my-2">
            Make a <span className="green-text">Vote</span>
          </h4>
        </Card.Header>
        <Card.Body className="px-md-4">
          {surveyState.loading ? (
            <Spinner animation="border" className="m-auto d-block" />
          ) : (
            <>
              <SurveyHeader />
              <Form className="mt-4" onSubmit={handleSubmit}>
                {surveyState.answers &&
                  surveyState.answers.map((answer) => (
                    <Form.Group key={answer.id}>
                      <Form.Check
                        type={
                          surveyState.survey.multipleAnswers
                            ? "checkbox"
                            : "radio"
                        }
                        label={answer.value}
                        id={answer.id}
                        checked={answer.checked}
                        onChange={() => handleAnswerChange(answer.id)}
                      />
                    </Form.Group>
                  ))}
                <div className="d-flex flex-column flex-md-row justify-content-between mt-5">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-5"
                    disabled={surveyState.isValid ? false : true}
                  >
                    Vote
                  </Button>
                  <div className="d-flex justify-content-between mt-md-0 mt-3">
                    <Link to={`/surveys/${surveyState.survey._id}/results`}>
                      <Button
                        type="button"
                        variant="info"
                        className="mr-4 px-5"
                      >
                        <Image src={ResultsIcon} height="18" className="mr-2" />
                        Results
                      </Button>
                    </Link>
                    <ShareSurveyPopover history={props.history} />
                  </div>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
