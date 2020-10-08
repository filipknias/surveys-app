import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Components
import SurveyCardHeader from "../components/surveys/SurveyCardHeader";
import ShareSurveyPopover from "../components/surveys/ShareSurveyPopover";
import Error from "../components/Error";
// Bootstrap
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
        // Set answers
        const answersState = res.data.answers.map((answer) => {
          return {
            ...answer,
            checked: false,
          };
        });
        dispatch({
          type: SET_VALUES,
          payload: {
            survey: {
              ...res.data,
              answers: answersState,
            },
          },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        // Set error
        dispatch({
          type: SET_VALUES,
          payload: { error: err.response.data.error },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  }, []);

  // Answers validation
  useEffect(() => {
    if (Object.keys(surveyState.survey).length === 0) return;

    const checkedAnswers = surveyState.survey.answers.filter((answer) => {
      return answer.checked === true;
    });
    if (checkedAnswers.length < 1) {
      dispatch({ type: SET_INVALID });
    } else {
      dispatch({ type: SET_VALID });
    }
  }, [surveyState.survey.answers]);

  // Submit vote
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get checked answers values
    const checkedAnswers = surveyState.survey.answers.filter((answer) => {
      return answer.checked === true;
    });
    // Format checked array to only values array
    const answersValues = checkedAnswers.map((answer) => {
      return answer.value;
    });

    // Clear survey state
    dispatch({
      type: SET_VALUES,
      payload: {
        survey: {},
        error: null,
        isValid: false,
      },
    });

    axios
      .post(`/api/votes/${surveyState.survey._id}`, { answers: answersValues })
      .then(() => {
        // Clear error
        dispatch({
          type: SET_VALUES,
          payload: { error: null },
        });
        props.history.push(`/surveys/${surveyState.survey._id}/results`);
      })
      .catch((err) => {
        // Set error
        dispatch({
          type: SET_VALUES,
          payload: { error: err.response.data.error },
        });
      });
  };

  // Answers change state update
  const handleAnswerChange = (answerId) => {
    const { survey } = surveyState;

    const updatedAnswers = survey.answers.map((answer) => {
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
      payload: {
        survey: {
          ...survey,
          answers: updatedAnswers,
        },
      },
    });
  };

  return (
    <>
      {surveyState.error ? (
        <Error message={surveyState.error} />
      ) : (
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
                <SurveyCardHeader />
                <Form className="mt-4" onSubmit={handleSubmit}>
                  {surveyState.survey.answers &&
                    surveyState.survey.answers.map((answer) => (
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
                          <Image
                            src={ResultsIcon}
                            height="18"
                            className="mr-2"
                          />
                          Results
                        </Button>
                      </Link>
                      <ShareSurveyPopover />
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
