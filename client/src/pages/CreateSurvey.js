import React, { useContext } from "react";
import axios from "axios";
// Components
import SurveyInfoForm from "../components/forms/SurveyInfoForm";
import SurveyAnswersForm from "../components/forms/SurveyAnswersForm";
import SurveyOptionsForm from "../components/forms/SurveyOptionsForm";
// Bootstrap
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
// Context
import { UserContext } from "../context/UserContext";
import { FormContext } from "../context/FormContext";
// Reducers Types
import {
  NEXT_STEP,
  PREV_STEP,
  SET_ERRORS,
  START_LOADING,
  STOP_LOADING,
} from "../reducers/types";

export default function CreateSurvey({ history }) {
  // Context
  const [userState] = useContext(UserContext);
  const [formState, dispatch] = useContext(FormContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent submit on prev steps
    if (formState.currentStep !== formState.steps.length) return;

    // Start loading
    dispatch({ type: START_LOADING });

    const { values } = formState;
    // New Survey Data
    const filledAnswers = values.answers.filter((answer) => {
      return answer.value !== "";
    });
    const newSurveyData = {
      title: values.title,
      description: values.description,
      answers: filledAnswers,
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
        // Redirect to survey vote page
        history.push(`/surveys/${res.data._id}/vote`);
        // Stop loading
        dispatch({ type: STOP_LOADING });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: { general: err.response.data },
        });
        // Stop loading
        dispatch({ type: STOP_LOADING });
      });
  };

  const FormHeader = () => {
    const { currentStep, steps } = formState;

    return (
      <div className="my-3 text-center">
        <h2>
          <span className="green-text">{currentStep}</span>/{steps.length}
        </h2>
        <h5>{steps[currentStep - 1].header}</h5>
      </div>
    );
  };

  const FormContent = () => {
    switch (formState.currentStep) {
      case 1:
        return <SurveyInfoForm />;
      case 2:
        return <SurveyAnswersForm />;
      case 3:
        return (
          <>
            <SurveyOptionsForm />
            <div className="mt-4">
              <h5 className="text-center text-muted">
                Submit your survey and share to the world.
              </h5>
              <Button
                variant="success"
                type="submit"
                className="mt-3"
                block
                disabled={formState.isValid ? false : true}
              >
                {formState.loading ? (
                  <Spinner animation="border" className="m-auto d-block" />
                ) : (
                  <p>Save</p>
                )}
              </Button>
            </div>
          </>
        );
      default:
        return;
    }
  };

  return (
    <>
      {!userState.isAuth && (
        <Alert variant="danger">
          <Alert.Heading>Sign in to get more advantages!</Alert.Heading>
          <p>
            To be able to create surveys and share them to the world you need to
            join us by creating a free account or sign in by clicking on the
            navbar button.
          </p>
        </Alert>
      )}
      <Card border="dark">
        <Card.Header className="text-center">
          <h4 className="my-2">
            Create your own <span className="green-text">custom survey</span>
          </h4>
        </Card.Header>
        <Card.Body className="px-md-5">
          {FormHeader()}
          {formState.errors.general && (
            <Alert variant="warning">
              <Alert.Heading>Somethink went wrong...</Alert.Heading>
              <p>Please refresh page or try again later.</p>
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>{FormContent()}</Form>
          <div className="d-flex justify-content-between mt-5">
            {formState.currentStep > 1 && (
              <Button
                variant="outline-primary"
                size="lg"
                className="px-5"
                onClick={() => dispatch({ type: PREV_STEP })}
              >
                Prev
              </Button>
            )}
            {formState.currentStep < formState.steps.length && (
              <Button
                variant="primary"
                size="lg"
                className="px-5 ml-auto"
                onClick={() => dispatch({ type: NEXT_STEP })}
                disabled={formState.isValid ? false : true}
              >
                Next
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
