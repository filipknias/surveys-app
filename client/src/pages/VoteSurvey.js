import React, { useEffect, useState } from "react";
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
// Images
import ResultsIcon from "../components/img/results-icon.svg";

export default function VoteSurvey(props) {
  // State
  const [survey, setSurvey] = useState({});
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);

  // Set survey
  useEffect(() => {
    // Start loading
    setSurveyLoading(true);

    const cancelTokenSource = axios.CancelToken.source();
    const surveyId = props.match.params.surveyId;

    axios
      .get(`/api/surveys/get/${surveyId}`, {
        cancelToken: cancelTokenSource.token,
      })
      .then((res) => {
        // Set answers
        const answersState = res.data.answers.map((answer) => {
          return {
            ...answer,
            checked: false,
          };
        });
        // Set survey
        setSurvey({
          ...res.data,
          answers: answersState,
        });
        // Stop loading
        setSurveyLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setSurveyLoading(false);
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  // Answers validation
  useEffect(() => {
    if (Object.keys(survey).length === 0) return;

    const checkedAnswers = survey.answers.filter((answer) => {
      return answer.checked === true;
    });
    if (checkedAnswers.length < 1) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [survey.answers]);

  // Submit vote
  const handleSubmit = (e) => {
    e.preventDefault();
    // Start loading
    setVoteLoading(true);
    // Get checked answers values
    const checkedAnswers = survey.answers.filter((answer) => {
      return answer.checked === true;
    });
    // Format checked array to only values array
    const answersValues = checkedAnswers.map((answer) => {
      return {
        id: answer.id,
        value: answer.value,
      };
    });

    axios
      .post(`/api/votes/${survey._id}`, { answers: answersValues })
      .then(() => {
        // Clear error
        setError(null);
        // Stop loading
        setVoteLoading(false);
        props.history.push(`/surveys/${survey._id}/results`);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setVoteLoading(false);
      });
  };

  // Answers change state update
  const handleAnswerChange = (answerId) => {
    const updatedAnswers = survey.answers.map((answer) => {
      if (answer.id === answerId) {
        if (survey.multipleAnswers) {
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
        if (survey.multipleAnswers) {
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

    setSurvey((survey) => {
      return {
        ...survey,
        answers: updatedAnswers,
      };
    });
  };

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <Card border="dark">
          <Card.Header className="text-center" as="h5">
            Make a <span className="green-text">Vote</span>
          </Card.Header>
          <Card.Body className="px-md-4">
            {surveyLoading ? (
              <Spinner animation="border" className="m-auto d-block" />
            ) : (
              <>
                {survey.author && <SurveyCardHeader survey={survey} />}
                <Form className="mt-4" onSubmit={handleSubmit}>
                  {survey.answers &&
                    survey.answers.map((answer) => (
                      <Form.Group key={answer.id}>
                        <Form.Check
                          type={survey.multipleAnswers ? "checkbox" : "radio"}
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
                      disabled={valid ? false : true}
                    >
                      {voteLoading ? (
                        <Spinner
                          animation="border"
                          className="m-auto d-block"
                        />
                      ) : (
                        <p>Vote</p>
                      )}
                    </Button>
                    <div className="d-flex justify-content-between mt-md-0 mt-3">
                      <Link to={`/surveys/${survey._id}/results`}>
                        <Button
                          type="button"
                          variant="info"
                          className="mr-4 px-md-5"
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
