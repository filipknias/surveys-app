import React, { useContext, useState, useEffect } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
// Context
import { FormContext } from "../../context/FormContext";
// Reducer Types
import {
  SET_VALUES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_VALID,
  SET_INVALID,
} from "../../reducers/types";

export default function SurveyOptionsForm() {
  // Context
  const [formState, dispatch] = useContext(FormContext);
  // State
  const [expirationDate, setExpirationDate] = useState(false);

  const hourValidation = () => {
    const {
      values: { expirationDate },
    } = formState;

    if (expirationDate.hour < 1 || expirationDate.hour > 24) return false;
    else if (expirationDate.hour === "") return false;
    else return true;
  };

  const minuteValidation = () => {
    const {
      values: { expirationDate },
    } = formState;

    if (expirationDate.minute < 0 || expirationDate.minute > 59) return false;
    else if (expirationDate.minute === "") return false;
    else return true;
  };

  // Expiration Date ON/OFF
  useEffect(() => {
    if (expirationDate === true) {
      // Get current time
      const dateNow = new Date();
      const hourNow = dateNow.getHours();
      const minutesNow = dateNow.getMinutes();
      // Format expiration date to Date format
      const formattedDate = dateNow.toISOString().substring(0, 10);
      // Set expiration date
      dispatch({
        type: SET_VALUES,
        payload: {
          expirationDate: {
            ...formState.values.expirationDate,
            date: formattedDate,
            hour: hourNow,
            minute: minutesNow,
          },
        },
      });
    } else {
      // Reset expiration date
      dispatch({
        type: SET_VALUES,
        payload: {
          expirationDate: {
            ...formState.values.expirationDate,
            date: null,
            hour: null,
            minute: null,
          },
        },
      });
      // Clear errors
      dispatch({
        type: CLEAR_ERRORS,
        payload: { expirationDate: null },
      });
    }
  }, [expirationDate]);

  // Expiration Date Validation
  useEffect(() => {
    if (formState.values.expirationDate.date === null) return;

    const dateNow = Date.now();
    const expirationDate = Date.parse(
      formState.values.expirationDate.formattedDate
    );

    if (dateNow > expirationDate) {
      dispatch({
        type: SET_ERRORS,
        payload: { expirationDate: "Invalid date." },
      });
    } else if (!hourValidation() || !minuteValidation()) {
      dispatch({
        type: SET_ERRORS,
        payload: { expirationDate: "Invalid time of expiring." },
      });
    } else {
      dispatch({
        type: CLEAR_ERRORS,
        payload: { expirationDate: null },
      });
    }
  }, [formState.values.expirationDate.formattedDate]);

  // Error values check
  useEffect(() => {
    if (!formState.errors.expirationDate) {
      dispatch({ type: SET_VALID });
    } else {
      dispatch({ type: SET_INVALID });
    }
  }, [formState.errors.expirationDate]);

  // Formating expiration date after changing values
  useEffect(() => {
    const {
      values: { expirationDate },
    } = formState;

    if (expirationDate.date === null) return;

    const date = new Date(expirationDate.date);
    const formattedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      expirationDate.hour,
      expirationDate.minute
    );

    dispatch({
      type: SET_VALUES,
      payload: {
        expirationDate: {
          ...expirationDate,
          formattedDate,
        },
      },
    });
  }, [
    formState.values.expirationDate.date,
    formState.values.expirationDate.hour,
    formState.values.expirationDate.minute,
  ]);

  const handleStatusChange = (e) => {
    dispatch({
      type: SET_VALUES,
      payload: { status: e.target.value },
    });
  };

  const handleDateChange = (e) => {
    dispatch({
      type: SET_VALUES,
      payload: {
        expirationDate: {
          ...formState.values.expirationDate,
          date: e.target.value,
        },
      },
    });
  };

  const handleHourChange = (e) => {
    // Set hour in context state
    dispatch({
      type: SET_VALUES,
      payload: {
        expirationDate: {
          ...formState.values.expirationDate,
          hour: e.target.value,
        },
      },
    });
  };

  const handleMinuteChange = (e) => {
    // Set hour in minute state
    dispatch({
      type: SET_VALUES,
      payload: {
        expirationDate: {
          ...formState.values.expirationDate,
          minute: e.target.value,
        },
      },
    });
  };

  const handleMultipleAnswers = () => {
    dispatch({
      type: SET_VALUES,
      payload: { multipleAnswers: !formState.values.multipleAnswers },
    });
  };

  return (
    <>
      {expirationDate && formState.errors.expirationDate && (
        <Alert variant="warning">{formState.errors.expirationDate}</Alert>
      )}
      <Form.Group>
        <Form.Label htmlFor="status">Status</Form.Label>
        <Form.Control
          id="status"
          value={formState.values.status}
          as="select"
          className="w-25"
          onChange={(e) => handleStatusChange(e)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Expiration Date"
          id="expiration-date"
          checked={expirationDate}
          onChange={() => setExpirationDate((prevDate) => !prevDate)}
        />
        {expirationDate && (
          <>
            <Form.Group>
              <Form.Control
                type="date"
                className="w-25 mt-2"
                onChange={(e) => handleDateChange(e)}
                value={
                  formState.values.expirationDate.date
                    ? formState.values.expirationDate.date
                    : ""
                }
              ></Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-between w-25 mt-3">
              <Form.Group>
                <Form.Label>Hour</Form.Label>
                <Form.Control
                  type="number"
                  value={
                    formState.values.expirationDate.hour
                      ? formState.values.expirationDate.hour
                      : ""
                  }
                  min="1"
                  max="24"
                  onChange={(e) => handleHourChange(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Minute</Form.Label>
                <Form.Control
                  type="number"
                  value={
                    formState.values.expirationDate.minute
                      ? formState.values.expirationDate.minute
                      : ""
                  }
                  min="0"
                  max="59"
                  onChange={(e) => handleMinuteChange(e)}
                />
              </Form.Group>
            </div>
          </>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Allow multiple answers"
          id="multiple-answers"
          checked={formState.values.multipleAnswers}
          onChange={handleMultipleAnswers}
        />
      </Form.Group>
    </>
  );
}
