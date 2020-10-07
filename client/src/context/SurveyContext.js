import React, { createContext, useReducer } from "react";
import SurveyReducer from "../reducers/SurveyReducer";

const initialState = {
  survey: {},
  error: null,
  isValid: false,
  loading: false,
};
export const SurveyContext = createContext([initialState, () => {}]);

export const SurveyProvider = (props) => {
  const [surveyState, dispatch] = useReducer(SurveyReducer, initialState);
  return (
    <SurveyContext.Provider value={[surveyState, dispatch]}>
      {props.children}
    </SurveyContext.Provider>
  );
};
