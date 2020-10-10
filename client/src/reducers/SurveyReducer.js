import {
  SET_VALUES,
  SET_VALID,
  SET_INVALID,
  START_SURVEY_LOADING,
  STOP_SURVEY_LOADING,
  START_VOTE_LOADING,
  STOP_VOTE_LOADING,
} from "./types";

export default function SurveyReducer(state, action) {
  switch (action.type) {
    case SET_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    case SET_VALID:
      return {
        ...state,
        isValid: true,
      };
    case SET_INVALID:
      return {
        ...state,
        isValid: false,
      };
    case START_SURVEY_LOADING:
      return {
        ...state,
        surveyLoading: true,
      };
    case STOP_SURVEY_LOADING:
      return {
        ...state,
        surveyLoading: false,
      };
      case START_VOTE_LOADING:
      return {
        ...state,
        voteLoading: true,
      };
      case STOP_VOTE_LOADING:
      return {
        ...state,
        voteLoading: false,
      };
    default:
      return state;
  }
}
