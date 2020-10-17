import React from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
// Images
import PieChart from "../img/pie-chart.svg";
import ResultsIcon from "../img/results-icon.svg";

export default function ProfileSurveys({ user, surveys }) {
  console.log(surveys);

  const badgeStyles = {
    textTransform: "uppercase",
    fontWeight: "500",
  };

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
    <Table responsive>
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
          <tr>
            <td className="d-flex">
              <Image
                src={PieChart}
                height="40"
                className="mr-3 d-none d-lg-block"
              />
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
            <td>
              {survey.status === "public" ? (
                <Badge
                  variant="success"
                  style={badgeStyles}
                  className="py-2 px-4"
                >
                  {survey.status}
                </Badge>
              ) : (
                <Badge
                  variant="danger"
                  style={badgeStyles}
                  className="py-2 px-4"
                >
                  {survey.status}
                </Badge>
              )}
            </td>
            <td>
              <ButtonGroup>
                <Button type="button" variant="primary">
                  <Link to={`/surveys/${survey._id}/vote`}>
                    <Image src={ResultsIcon} height="18" className="mr-2" />
                    Vote
                  </Link>
                </Button>
                <Button type="button" variant="info">
                  <Link to={`/surveys/${survey._id}/results`}>
                    <Image src={ResultsIcon} height="18" className="mr-2" />
                    Results
                  </Link>
                </Button>
                <Button type="button" variant="danger">
                  <Image src={ResultsIcon} height="18" className="mr-2" />
                  Delete
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
