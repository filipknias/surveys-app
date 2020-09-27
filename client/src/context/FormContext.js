import React, { createContext, useReducer } from "react";
import FormReducer from "../reducers/FormReducer";

const initialState = {
  currentStep: 1,
  steps: [
    {
      step: 1,
      header: "Main info about your survey.",
    },
    {
      step: 2,
      header: "Add answers to your survey.",
    },
    {
      step: 3,
      header: "Additional options about your survey.",
    },
  ],
  values: {
    title: "",
    description: "",
    status: "public",
    expirationDate: {
      date: null,
      hour: null,
      minute: null,
      formattedDate: null,
    },
    answers: [
      {
        id: 1,
        value: "",
      },
      {
        id: 2,
        value: "",
      },
    ],
  },
  errors: {},
  isValid: false,
  loading: false,
};

export const FormContext = createContext([initialState, () => {}]);

export const FormProvider = (props) => {
  const [formState, dispatch] = useReducer(FormReducer, initialState);

  return (
    <FormContext.Provider value={[formState, dispatch]}>
      {props.children}
    </FormContext.Provider>
  );
};
