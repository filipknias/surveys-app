import React, { useEffect, useContext } from "react";
import axios from "axios";
// Components
import SurveyHeader from "../components/SurveyHeader";
// Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
// Context
import { UserContext } from "../context/UserContext";
import { SurveyContext } from "../context/SurveyContext";
// Reducer Types
import {
  SET_VALUES,
  SET_VALID,
  SET_INVALID,
  START_LOADING,
  STOP_LOADING,
} from "../reducers/types";

export default function ResultsSurvey(props) {
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

  return (
    <>
      <Card border="dark">
        <Card.Header className="text-center">
          <h4 className="my-2">
            See <span className="green-text">Results</span>
          </h4>
        </Card.Header>
        <Card.Body>
          {surveyState.loading ? (
            <Spinner animation="border" className="m-auto d-block" />
          ) : (
            <>
              <SurveyHeader survey={surveyState.survey} />
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
