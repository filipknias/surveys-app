import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
// Context
import { UserContext } from "../context/UserContext";
import { SurveyContext } from "../context/SurveyContext";
// Images
import EditIcon from "../components/img/edit-icon.svg";

export default function SurveyHeader() {
  // Context
  const [userState] = useContext(UserContext);
  const [surveyState] = useContext(SurveyContext);
  // State
  const [surveyAuthor, setSurveyAuthor] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  // Set survey author
  useEffect(() => {
    // Check if survey is fetched
    if (Object.keys(surveyState.survey).length === 0) return;
    axios
      .get(`/api/users/${surveyState.survey.author}`)
      .then((res) => {
        // Set survey author
        setSurveyAuthor(res.data);
      })
      .catch(() => {
        // If there is any error set survye author to empty string
        setSurveyAuthor("");
      });
    // Set formatted created at date
    setCreatedAt(formatCreatedAtDate(surveyState.survey.createdAt));
    // Set formatted expiration date if there is any
    if (surveyState.survey.expirationDate) {
      setExpirationDate(
        formatExpirationDate(surveyState.survey.expirationDate)
      );
    }
  }, []);

  // Format created at date
  const formatCreatedAtDate = (date) => {
    const dateString = new Date(date).toDateString();
    const formattedDate = dateString.substr(3, dateString.length);
    return formattedDate;
  };

  // Format expiration date
  const formatExpirationDate = (date) => {
    const dateString = new Date(date).toLocaleString();
    const formattedDate = dateString.substr(0, dateString.length - 3);
    return formattedDate;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <Card.Title>{surveyState.survey.title}</Card.Title>
          {surveyState.survey.description && (
            <p className="mb-3 mt-2">{surveyState.survey.description}</p>
          )}
          {createdAt && surveyAuthor && (
            <Card.Subtitle className="text-muted">
              {createdAt} - by {surveyAuthor.displayName}
            </Card.Subtitle>
          )}
        </div>
        {userState.isAuth && surveyState.survey.author === userState.user._id && (
          <Button variant="secondary">
            <Image src={EditIcon} height="14" className="mr-2" />
            Edit
          </Button>
        )}
      </div>
      {expirationDate && (
        <Alert variant="info" className="mt-3 mb-4">
          This survey has expiration date set to:
          <b> {expirationDate}</b>. After this time survey will be closed.
        </Alert>
      )}
    </>
  );
}
