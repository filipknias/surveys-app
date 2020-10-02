import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Components
import SurveyHeader from "../components/SurveyHeader";
import ShareSurveyPopover from "../components/ShareSurveyPopover";
// Bootstrap
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
// Images
import ResultsIcon from "../components/img/results-icon.svg";
// Context
import { SurveyContext } from "../context/SurveyContext";
// Reducer Types
import { SET_VALUES, START_LOADING, STOP_LOADING } from "../reducers/types";

export default function ResultsSurvey(props) {
  // Context
  const [surveyState, dispatch] = useContext(SurveyContext);
  // State
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

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

  // Set votes
  useEffect(() => {
    // Check if survey is fetched
    if (Object.keys(surveyState.survey).length === 0) return;

    // Get all votes from this survey
    axios
      .get(`/api/votes/${surveyState.survey._id}`)
      .then((res) => {
        // Get survey votes in one array
        const surveyVotes = res.data.map((vote) => {
          return vote.answers.map((answer) => {
            return answer;
          });
        });
        // Set formatted votes and total votes
        setVotes(formatVotes(surveyVotes));
        setTotalVotes(surveyVotes.length);
      })
      .catch((err) => {
        dispatch({
          type: SET_VALUES,
          payload: { error: err.response.data },
        });
      });
  }, [surveyState]);

  // Format votes
  const formatVotes = (votes) => {
    // Get all answers in one array
    const answersValues = surveyState.answers.map((answer) => {
      return answer.value;
    });

    // Get all votes in one array
    const votesValues = votes.reduce((total, current) => {
      return total.concat(current);
    }, []);

    // Sort all votes by their answer
    const formattedAnswers = answersValues.map((answerValue) => {
      return votesValues.filter((voteValue) => {
        return voteValue === answerValue;
      });
    });

    // Format sorted votes to object with answer and votesCount as keys
    const formattedVotes = formattedAnswers.map((vote, index) => {
      return {
        answer: answersValues[index],
        votesCount: vote.length,
      };
    });

    // Sort formatted votes by descending order
    const sortedVotes = formattedVotes.sort((a, b) => {
      return b.votesCount - a.votesCount;
    });

    return sortedVotes;
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
            See <span className="green-text">Results</span>
          </h4>
        </Card.Header>
        <Card.Body>
          {surveyState.loading ? (
            <Spinner animation="border" className="m-auto d-block" />
          ) : (
            <>
              <SurveyHeader />
              {votes.map((vote) => (
                <p>
                  {vote.answer} - {vote.votesCount}
                </p>
              ))}
              <div className="d-flex justify-content-between justify-content-md-end mt-5">
                <Link to={`/surveys/${surveyState.survey._id}/vote`}>
                  <Button type="button" variant="info" className=" mr-4 px-5">
                    <Image src={ResultsIcon} height="18" className="mr-2" />
                    Vote
                  </Button>
                </Link>
                <ShareSurveyPopover history={props.history} />
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
