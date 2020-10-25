import React, { useContext, useEffect } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
// Context
import { FormContext } from "../../context/FormContext";
// Reducer Types
import {
  SET_VALUES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_VALID,
} from "../../reducers/types";

export default function SurveyAnswersForm() {
  const [formState, dispatch] = useContext(FormContext);

  // Answers validation
  useEffect(() => {
    const filledAnswers = formState.values.answers.filter((answer) => {
      return answer.value.trim() !== "";
    });

    if (filledAnswers.length < 2) {
      dispatch({
        type: SET_ERRORS,
        payload: {
          answers: "Add more answers to your survey.",
        },
      });
    } else {
      dispatch({
        type: CLEAR_ERRORS,
        payload: { answers: null },
      });
      dispatch({ type: SET_VALID });
    }
  }, [formState.values.answers]);

  const handleAddAnswer = () => {
    const {
      values: { answers },
    } = formState;
    // Prepare New Answer Object
    const answersCount = answers.length;
    const answerId = answers[answersCount - 1].id + 1;
    const answerData = {
      id: answerId,
      value: "",
    };

    // Set New Answer
    dispatch({
      type: SET_VALUES,
      payload: { answers: [...answers, answerData] },
    });
  };

  const handleAnswerChange = (e, answerId) => {
    // Update Answers Value With Given Id
    const updatesAnswers = formState.values.answers.map((answer) => {
      if (answer.id === answerId) {
        return {
          ...answer,
          value: e.target.value,
        };
      } else {
        return answer;
      }
    });
    // Set Answer Value
    dispatch({
      type: SET_VALUES,
      payload: { answers: updatesAnswers },
    });
  };

  return (
    <>
      {formState.errors.answers && (
        <Alert variant="warning">
          <p>{formState.errors.answers}</p>
        </Alert>
      )}

      {formState.values.answers.map((answer, index) => (
        <Form.Group key={answer.id}>
          <Form.Label htmlFor={`answer${index + 1}`}>
            Answer #{answer.id}
          </Form.Label>
          <Form.Control
            type="text"
            id={`answer${answer.id}`}
            placeholder="Answer title..."
            value={answer.value}
            onChange={(e) => handleAnswerChange(e, answer.id)}
          />
        </Form.Group>
      ))}
      <Button
        variant="primary"
        type="button"
        className="mt-4"
        block
        onClick={handleAddAnswer}
      >
        Add Answer
      </Button>
    </>
  );
}
