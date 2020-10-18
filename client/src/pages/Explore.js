import React, { useState, useEffect } from "react";
import axios from "axios";
// Components
import SurveysList from "../components/surveys/SurveysList";
import Error from "../components/Error";
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
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [filter, setFilter] = useState("createdAt");
  const [limit, setLimit] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  // Submit searching
  const handleSubmit = (e) => {
    e.preventDefault();
    // Set current page to 1
    setCurrentPage(1);
    // Make a search request
    searchRequest(title, filter, currentPage, limit);
  };

  // Make search request every time current page changes
  useEffect(() => {
    // Prevent from searching without survey results
    if (Object.keys(results).length === 0) return;
    // Make a search request
    if (valid) {
      searchRequest(title, filter, currentPage, limit);
    }
  }, [currentPage, filter, limit]);

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
        setResults(res.data);
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

  // Search input validation
  useEffect(() => {
    if (title.trim() === "") setValid(false);
    else setValid(true);
  }, [title]);

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
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="search-form">
                <Form.Label>Search by title</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Survey title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="ml-2 px-md-5"
                    disabled={valid ? false : true}
                  >
                    Search
                  </Button>
                </div>
              </Form.Group>
              <div className="d-flex">
                <Form.Group controlId="filter-form">
                  <Form.Label>Filter</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="createdAt">Latest</option>
                    <option value="votesCount">Most Popular</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="limit-form" className="ml-4">
                  <Form.Label>Limit</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setLimit(e.target.value)}
                  >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </Form>
            <hr />
            {loading ? (
              <Spinner animation="border" className="mx-auto d-block" />
            ) : (
              <>
                {results.results && results.results.length > 0 ? (
                  <div className="mt-5">
                    <>
                      <SurveysList surveys={results.results} />
                      <Pagination className="mt-4">
                        {results.previous && (
                          <Pagination.Item
                            onClick={() =>
                              setCurrentPage(results.previous.page)
                            }
                          >
                            {results.previous.page}
                          </Pagination.Item>
                        )}
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        {results.next && (
                          <Pagination.Item
                            onClick={() => setCurrentPage(results.next.page)}
                          >
                            {results.next.page}
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
