import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SearchBar({
  currentPage,
  setCurrentPage,
  searchRequest,
}) {
  // State
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [valid, setValid] = useState(false);
  const [filter, setFilter] = useState("createdAt");
  const [limit, setLimit] = useState(5);

  // Submit searching
  const handleSubmit = (e) => {
    e.preventDefault();
    // Reset current page state
    setCurrentPage(1);
    // Set query to title state
    setQuery(title);
  };

  // Make search request and reset current page every time when query changes
  useEffect(() => {
    // Reset current page state
    setCurrentPage(1);
    // Make a search request
    const cancelTokenSource = axios.CancelToken.source();
    searchRequest(query, filter, currentPage, limit, cancelTokenSource);

    return () => {
      cancelTokenSource.cancel();
    };
  }, [query]);

  // Make search request every time current page, filter or limit changes
  useEffect(() => {
    // Make a search request
    const cancelTokenSource = axios.CancelToken.source();
    searchRequest(query, filter, currentPage, limit, cancelTokenSource);

    return () => {
      cancelTokenSource.cancel();
    };
  }, [currentPage, filter, limit]);

  // Reset current page every time filter or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, limit]);

  // Search input validation
  useEffect(() => {
    if (title.trim() === "") setValid(false);
    else setValid(true);
  }, [title]);

  // Refresh search bar
  const handleRefresh = () => {
    setTitle("");
    setQuery("");
    setCurrentPage(1);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="search-form">
        <Form.Label>Search by title</Form.Label>
        <div className="d-flex flex-column flex-md-row">
          <Form.Control
            type="text"
            placeholder="Survey title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            className="ml-2 px-md-5 mt-2 mt-md-0"
            disabled={valid ? false : true}
          >
            Search
          </Button>
          <Button
            variant="info"
            type="button"
            className="ml-2 px-md-5 mt-2 mt-md-0"
            onClick={handleRefresh}
            disabled={query === "" ? true : false}
          >
            Clear
          </Button>
        </div>
      </Form.Group>
      <div className="d-flex">
        <Form.Group controlId="filter-form">
          <Form.Label>Filter</Form.Label>
          <Form.Control as="select" onChange={(e) => setFilter(e.target.value)}>
            <option value="createdAt">Latest</option>
            <option value="votesCount">Most Popular</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="limit-form" className="ml-4">
          <Form.Label>Limit</Form.Label>
          <Form.Control as="select" onChange={(e) => setLimit(e.target.value)}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Form.Control>
        </Form.Group>
      </div>
    </Form>
  );
}
