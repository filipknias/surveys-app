import React, { useState, useEffect } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SearchBar({
  currentPage,
  setCurrentPage,
  searchRequest,
}) {
  // State
  const [title, setTitle] = useState("");
  const [valid, setValid] = useState(false);
  const [filter, setFilter] = useState("createdAt");
  const [limit, setLimit] = useState(3);

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
    // Make a search request
    if (valid) {
      searchRequest(title, filter, currentPage, limit);
    }
  }, [currentPage, filter, limit]);

  // Set page to 1 if filter or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, limit]);

  // Search input validation
  useEffect(() => {
    if (title.trim() === "") setValid(false);
    else setValid(true);
  }, [title]);

  return (
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
