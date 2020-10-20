import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// Bootstrap
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
// Images
import PieChart from "../img/pie-chart.svg";
import ResultsIcon from "../img/results-icon.svg";
import VoteIcon from "../img/vote-icon.svg";
import DeleteIcon from "../img/delete-icon.svg";
import EditIcon from "../img/edit-icon.svg";
import CollapseIcon from "../img/collapse-icon.svg";
// Components
import SearchBar from "../surveys/SearchBar";
import Error from "../Error";
// Functions
import {
  formatExpirationDate,
  formatCreatedAtDate,
} from "../functions/dateFormatting";

export default function ProfileSurveys({ user }) {
  // State
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const badgeStyles = {
    textTransform: "uppercase",
    fontWeight: "500",
  };

  // Request to search surveys
  const searchRequest = (
    titleValue,
    sortValue,
    currentPageValue,
    limitValue
  ) => {
    // Start loading
    setLoading(true);
    axios
      .get(
        `/api/surveys/users/${
          user._id
        }?sort=${sortValue}&title=${titleValue.trim()}&page=${currentPageValue}&limit=${limitValue}`
      )
      .then((res) => {
        // Clear error
        setError(null);
        // Set surveys
        setResponse(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setLoading(false);
      });
  };

  // Fetch all surveys
  useEffect(() => {
    getResponse();
  }, [user]);

  const getResponse = () => {
    // Start loading
    setLoading(true);
    axios
      .get(
        `/api/surveys/users/${user._id}?sort=createdAt&page=${currentPage}&limit=5`
      )
      .then((res) => {
        // Clear error
        setError(null);
        // Set surveys
        setResponse(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setLoading(false);
      });
  };

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <>
          <Accordion>
            <Accordion.Toggle
              as={Card.Header}
              className="d-flex justify-content-center align-items-center"
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <p>Search surveys</p>
              <Image src={CollapseIcon} height="15" className="ml-3" />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="mt-4">
              <SearchBar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                searchRequest={searchRequest}
              />
            </Accordion.Collapse>
          </Accordion>

          <Button
            variant="info"
            className="mt-3 mb-4"
            onClick={() => getResponse()}
            block
          >
            Refresh Data
          </Button>
          <Table className="mt-4" responsive>
            {loading ? (
              <Spinner animation="border" className="mx-auto d-block" />
            ) : (
              <>
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
                  {response.results &&
                    response.results.map((survey) => (
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
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="vote-btn-tooltip">Vote</Tooltip>
                              }
                            >
                              <Link to={`/surveys/${survey._id}/vote`}>
                                <Button type="button" variant="primary">
                                  <Image src={VoteIcon} height="20" />
                                </Button>
                              </Link>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="results-btn-tooltip">
                                  Results
                                </Tooltip>
                              }
                            >
                              <Link to={`/surveys/${survey._id}/results`}>
                                <Button type="button" variant="info">
                                  <Image src={ResultsIcon} height="20" />
                                </Button>
                              </Link>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="edit-btn-tooltip">Edit</Tooltip>
                              }
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
                                <Tooltip id="delete-btn-tooltip">
                                  Delete
                                </Tooltip>
                              }
                            >
                              <Button type="button" variant="danger">
                                <Image src={DeleteIcon} height="20" />
                              </Button>
                            </OverlayTrigger>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </>
            )}
          </Table>
        </>
      )}
    </>
  );
}
