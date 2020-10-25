import React, { useContext } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
// Components
import SurveyInfoForm from "../forms/SurveyInfoForm";
import SurveyAnswersForm from "../forms/SurveyAnswersForm";
import SurveyOptionsForm from "../forms/SurveyOptionsForm";
// Context
import { FormContext } from "../../context/FormContext";
// Reducer types
import { PREV_STEP, NEXT_STEP } from "../../reducers/types";

export default function CreateSurveyForm({ handleSubmit }) {
  // Context
  const [formState, dispatch] = useContext(FormContext);

  // Form header
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

  // Form content based on the current step
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
      {FormHeader()}
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
    </>
  );
}
