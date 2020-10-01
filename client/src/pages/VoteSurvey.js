import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// Bootstrap
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
// Context
import { UserContext } from "../context/UserContext";
// Images
import EditIcon from "../components/img/edit-icon.svg";
import ResultsIcon from "../components/img/results-icon.svg";
import ShareIcon from "../components/img/share-icon.svg";

export default function VoteSurvey(props) {
  // State
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [survey, setSurvey] = useState({});
  const [surveyAuthor, setSurveyAuthor] = useState({});
  const [answers, setAnswers] = useState([]);
  const [expirationDate, setExpirationDate] = useState(null);
  // Context
  const [userState] = useContext(UserContext);

  const surveyDate = new Date(survey.createdAt);
  const formattedDate = surveyDate.toDateString().substr(3, surveyDate.length);

  // Set survey
  useEffect(() => {
    // Start loading
    setLoading(true);
    const surveyId = props.match.params.surveyId;
    axios
      .get(`/api/surveys/get/${surveyId}`)
      .then((res) => {
        // Set survey
        setSurvey(res.data);
        // Set survey author state
        getSurveyAuthor(res.data.author);
        // Set formatted expiration date
        if (res.data.expirationDate) {
          setExpirationDate(formatDate(res.data.expirationDate));
        }
        // Set answers state
        const answersState = res.data.answers.map((answer) => {
          return {
            ...answer,
            checked: false,
          };
        });
        setAnswers(answersState);
        // Stop loading
        setLoading(false);
      })
      .catch(() => {
        props.history.push("/");
        // Stop loading
        setLoading(false);
      });
  }, []);

  // Answers validation
  useEffect(() => {
    const checkedAnswers = answers.filter((answer) => {
      return answer.checked === true;
    });
    if (checkedAnswers.length < 1) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [answers]);

  // Get survey author data
  const getSurveyAuthor = (authorId) => {
    axios
      .get(`/api/users/${authorId}`)
      .then((res) => {
        setSurveyAuthor(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Submit vote
  const handleSubmit = (e) => {
    e.preventDefault();
    const checkedAnswers = answers.filter((answer) => {
      return answer.checked === true;
    });
    const answersValues = checkedAnswers.map((answer) => {
      return answer.value;
    });
    axios
      .post(`/api/votes/${survey._id}`, { answers: answersValues })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  // Answers change state update
  const handleAnswerChange = (answerId) => {
    const updatedAnswers = answers.map((answer) => {
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
    setAnswers(updatedAnswers);
  };

  // Format expiration date
  const formatDate = (date) => {
    const dateString = new Date(date).toLocaleString();
    const formattedDate = dateString.substr(0, dateString.length - 3);
    return formattedDate;
  };

  return (
    <>
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Somethink went wrong...</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      <Card border="dark">
        <Card.Header className="text-center">
          <h4 className="my-2">
            Make a <span className="green-text">Vote</span>
          </h4>
        </Card.Header>
        <Card.Body className="px-4">
          {loading ? (
            <Spinner animation="border" className="m-auto d-block" />
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>{survey.title}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    {formattedDate} - by {surveyAuthor.displayName}
                  </Card.Subtitle>
                </div>
                {userState.isAuth && survey.author === userState.user._id && (
                  <Button variant="secondary">
                    <Image src={EditIcon} height="14" className="mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              {expirationDate && (
                <Alert variant="info" className="mt-3 mb-4">
                  This survey has expiration date set to:
                  <b>{expirationDate}</b>. After this time survey will be
                  closed.
                </Alert>
              )}
              <Form className="mt-4" onSubmit={handleSubmit}>
                {answers &&
                  answers.map((answer) => (
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
                <div className="d-flex flex-column flex-md-row     justify-content-between mt-5">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-5"
                    disabled={valid ? false : true}
                  >
                    Vote
                  </Button>
                  <div className="d-flex justify-content-between mt-md-0 mt-3">
                    <Button type="button" variant="info" className="mr-4 px-5">
                      <Image src={ResultsIcon} height="18" className="mr-2" />
                      Results
                    </Button>
                    <Button type="button" variant="secondary" className="px-5">
                      <Image src={ShareIcon} height="18" className="mr-2" />
                      Share
                    </Button>
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
