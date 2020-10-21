import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
// Images
import CollapseIcon from "../img/collapse-icon.svg";
// Components
import SearchBar from "../surveys/SearchBar";
import Error from "../Error";
import ProfileSurveysTable from "../profile/ProfileSurveysTable";
// Functions

export default function ProfileSurveys({ user }) {
  // State
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

          {loading ? (
            <Spinner animation="border" className="mx-auto d-block" />
          ) : (
            <>
              {response.results && (
                <ProfileSurveysTable surveys={response.results} />
              )}
            </>
          )}
          {/* Pagination */}
        </>
      )}
    </>
  );
}
