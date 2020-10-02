import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
// Context
import { SurveyContext } from "../context/SurveyContext";
import { UserContext } from "../context/UserContext";
// Images
import EditIcon from "../components/img/edit-icon.svg";

export default function SurveyHeader() {
  // Context
  const [surveyState] = useContext(SurveyContext);
  const [userState] = useContext(UserContext);
  // State
  const [surveyAuthor, setSurveyAuthor] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    if (!surveyState.survey.author || !surveyState.survey.createdAt) return;

    axios
      .get(`/api/users/${surveyState.survey.author}`)
      .then((res) => {
        setSurveyAuthor(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setFormattedDate(formatDate(surveyState.survey.createdAt));
  }, [surveyState]);

  // Format expiration date
  const formatDate = (date) => {
    const dateString = new Date(date).toDateString();
    const formattedDate = dateString.substr(3, dateString.length);
    return formattedDate;
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <Card.Title>{surveyState.survey.title}</Card.Title>
          <Card.Subtitle className="text-muted">
            {formattedDate && surveyAuthor && (
              <>
                {formattedDate} - by {surveyAuthor.displayName}
              </>
            )}
          </Card.Subtitle>
        </div>
        {userState.isAuth && surveyState.survey.author === userState.user._id && (
          <Button variant="secondary">
            <Image src={EditIcon} height="14" className="mr-2" />
            Edit
          </Button>
        )}
      </div>
    </>
  );
}
