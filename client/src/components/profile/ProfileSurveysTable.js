import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
// Images
import PieChart from "../img/pie-chart.svg";
import ResultsIcon from "../img/results-icon.svg";
import VoteIcon from "../img/vote-icon.svg";
import DeleteIcon from "../img/delete-icon.svg";
import EditIcon from "../img/edit-icon.svg";
// Context
import { UserContext } from "../../context/UserContext";
// Functions
import {
  formatExpirationDate,
  formatCreatedAtDate,
} from "../functions/dateFormatting";

export default function ProfileSurveysTable({
  user,
  surveys,
  getSurveys,
  setError,
}) {
  // Context
  const [userState] = useContext(UserContext);

  // Styles
  const badgeStyles = {
    textTransform: "uppercase",
    fontWeight: "500",
  };

  // Badge component with survey status
  const badgeStatus = (status) => {
    let variant;

    switch (status) {
      case "public": {
        variant = "success";
        break;
      }
      case "private": {
        variant = "secondary";
        break;
      }
      case "closed": {
        variant = "danger";
        break;
      }
    }

    return (
      <Badge variant={variant} style={badgeStyles} className="py-2 px-4">
        {status}
      </Badge>
    );
  };

  // Delete survey
  const handleDelete = (surveyId) => {
    axios
      .delete(`/api/surveys/${surveyId}`)
      .then(() => {
        // Clear error
        setError(null);
        // Refresh surveys data
        const cancelTokenSource = axios.CancelToken.source();
        getSurveys(cancelTokenSource);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
      });
  };

  return (
    <Table className="mt-4" responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Created At</th>
          <th>Expiration Date</th>
          <th>Status</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {surveys.map((survey) => (
          <tr key={survey._id}>
            <td className="d-flex">
              <Image src={PieChart} height="40" className="mr-3" />
              <h5>{survey.title}</h5>
            </td>
            <td>{formatCreatedAtDate(survey.createdAt)}</td>
            <td>
              {survey.expirationDate ? (
                <>{formatExpirationDate(survey.expirationDate)}</>
              ) : (
                <p>None</p>
              )}
            </td>
            <td>{badgeStatus(survey.status)}</td>
            <td>
              <ButtonGroup>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="vote-btn-tooltip">Vote</Tooltip>}
                >
                  <Link to={`/surveys/${survey._id}/vote`}>
                    <Button type="button" variant="primary">
                      <Image src={VoteIcon} height="20" />
                    </Button>
                  </Link>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="results-btn-tooltip">Results</Tooltip>}
                >
                  <Link to={`/surveys/${survey._id}/results`}>
                    <Button type="button" variant="info">
                      <Image src={ResultsIcon} height="20" />
                    </Button>
                  </Link>
                </OverlayTrigger>
                {userState.user._id === user._id && (
                  <>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="edit-btn-tooltip">Edit</Tooltip>}
                    >
                      <Link to={`/surveys/${survey._id}/edit`}>
                        <Button type="button" variant="secondary">
                          <Image src={EditIcon} height="20" />
                        </Button>
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="delete-btn-tooltip">Delete</Tooltip>
                      }
                    >
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDelete(survey._id)}
                      >
                        <Image src={DeleteIcon} height="20" />
                      </Button>
                    </OverlayTrigger>
                  </>
                )}
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
