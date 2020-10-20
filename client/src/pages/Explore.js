import React, { useState, useEffect } from "react";
import axios from "axios";
// Components
import SurveysList from "../components/surveys/SurveysList";
import Error from "../components/Error";
import SearchBar from "../components/surveys/SearchBar";
// Bootstrap
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";
// Images
import NotFoundImage from "../components/img/not-found-image.svg";

export default function Explore() {
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
        `/api/surveys/get?sort=${sortValue}&title=${titleValue.trim()}&page=${currentPageValue}&limit=${limitValue}`
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
        <Card border="dark">
          <Card.Header className="text-center" as="h4">
            Explore <span className="green-text">surveys</span>
          </Card.Header>
          <Card.Body className="px-md-5">
            <SearchBar
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchRequest={searchRequest}
            />
            <hr />
            {loading ? (
              <Spinner animation="border" className="mx-auto d-block" />
            ) : (
              <>
                {response.results && response.results.length > 0 ? (
                  <div className="mt-5">
                    <>
                      <SurveysList surveys={response.results} />
                      <Pagination className="mt-4">
                        {response.previous && (
                          <Pagination.Item
                            onClick={() =>
                              setCurrentPage(response.previous.page)
                            }
                          >
                            {response.previous.page}
                          </Pagination.Item>
                        )}
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        {response.next && (
                          <Pagination.Item
                            onClick={() => setCurrentPage(response.next.page)}
                          >
                            {response.next.page}
                          </Pagination.Item>
                        )}
                      </Pagination>
                    </>
                  </div>
                ) : (
                  <>
                    <div className="my-5">
                      <h4 className="text-center">No surveys found.</h4>
                      <Image
                        src={NotFoundImage}
                        height="180"
                        className="d-block mx-auto mt-4"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
