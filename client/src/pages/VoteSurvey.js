import React from "react";

export default function VoteSurvey(props) {
  const surveyId = props.match.params.surveyId;
  return (
    <div>
      <h1>Vote in survey: {surveyId}</h1>
    </div>
  );
}
