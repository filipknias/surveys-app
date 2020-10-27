import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
// Images
import CollapseIcon from "../img/collapse-icon.svg";
import NotFoundImage from "../img/not-found-image.svg";
// Components
import SearchBar from "../surveys/SearchBar";
import Error from "../Error";
import ProfileSurveysTable from "../profile/ProfileSurveysTable";
import PaginationTabs from "../PaginationTabs";

export default function ProfileSurveys({ user, history }) {
  // State
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const DEFAULT_FILTER = "createdAt";
  const DEFAULT_LIMIT = "5";

  // Request to search surveys
  const searchRequest = (
    titleValue,
    sortValue,
    currentPageValue,
    limitValue
  ) => {
    if (user === null) return;
    // Start loading
    setLoading(true);
    axios
      .get(
        `/api/surveys/get?sort=${sortValue}&title=${titleValue.trim()}&page=${currentPageValue}&limit=${limitValue}&author=${
          user._id
        }`
      )
      .then((res) => {
        // Clear error
        setError(null);
        // Set surveys
        setResponse(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch(() => {
        // Redirect to home page
        history.push("/");
        // Stop loading
        setLoading(false);
      });
  };

  // Fetch all surveys
  useEffect(() => {
    if (user === null) return;
    getSurveys();
  }, [user]);

  // Get all the surveys created by given user
  const getSurveys = () => {
    if (user === null) return;
    // Reset current page
    setCurrentPage(1);
    // Start loading
    setLoading(true);
    axios
      .get(
        `/api/surveys/get?sort=${DEFAULT_FILTER}&page=${currentPage}&limit=${DEFAULT_LIMIT}&author=${user._id}`
      )
      .then((res) => {
        // Clear error
        setError(null);
        // Set surveys
        setResponse(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch(() => {
        // Redirect to home page
        history.push("/");
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

          {loading ? (
            <Spinner animation="border" className="mx-auto mt-4 d-block" />
          ) : (
            <>
              {response.results && response.results.length > 0 ? (
                <>
                  <ProfileSurveysTable
                    user={user}
                    surveys={response.results}
                    getSurveys={getSurveys}
                    setError={setError}
                  />
                  <div className="mt-md-0 mt-3">
                    <PaginationTabs
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      previousPage={
                        response.previous ? response.previous : null
                      }
                      nextPage={response.next ? response.next : null}
                    />
                  </div>
                </>
              ) : (
                <div className="my-4">
                  <h4 className="text-center">No surveys found.</h4>
                  <Image
                    src={NotFoundImage}
                    height="180"
                    className="d-block mx-auto mt-4"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
