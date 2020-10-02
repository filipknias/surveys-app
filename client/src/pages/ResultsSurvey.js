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
  // Context
  const [userState] = useContext(UserContext);
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
        // Set survey author
        getSurveyAuthor(res.data.author);
        // Set formatted expiration date
        if (res.data.expirationDate) {
          dispatch({
            type: SET_VALUES,
            payload: { expirationDate: formatDate(res.data.expirationDate) },
          });
        }
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

  // Get survey author data
  const getSurveyAuthor = (authorId) => {
    axios
      .get(`/api/users/${authorId}`)
      .then((res) => {
        dispatch({
          type: SET_VALUES,
          payload: { surveyAuthor: res.data },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Format expiration date
  const formatDate = (date) => {
    const dateString = new Date(date).toLocaleString();
    const formattedDate = dateString.substr(0, dateString.length - 3);
    return formattedDate;
  };

  return (
    <>
      <Card border="dark">
        <Card.Header className="text-center">
          <h4 className="my-2">
            See <span className="green-text">Results</span>
          </h4>
        </Card.Header>
        <Card.Body>
          <SurveyHeader />

          {surveyState.answers.map((answer) => (
            <h1>{answer.value}</h1>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}
