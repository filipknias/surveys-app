import React, { useState, useEffect } from "react";
import axios from 'axios';
// Components
import SurveysList from '../components/surveys/SurveysList';
import Error from '../components/Error';
// Bootstrap
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
// Images
import NotFoundImage from '../components/img/not-found-image.svg';

export default function Explore() {
  // State
  const [value, setValue] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [limit, setLimit] = useState(3);
  const [filter, setFilter] = useState('createdAt');
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Submit searching
  const handleSubmit = (e) => {
    e.preventDefault();
    // Start loading
    setLoading(true);
    axios.get(`/api/surveys/get?sort=${filter}&title=${value.trim()}`)
      .then((res) => {
        // Clear error
        setError(null);
        // Set surveys
        setSurveys(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setLoading(false);
      })
  };

  // Search input validation
  useEffect(() => {
    if (value.trim() === "") setValid(false);
    else setValid(true);
  }, [value])

  // Set pages
  useEffect(() => {
    // Check if surveys are fetched
    if (surveys.length === 0) return;

    if (surveys.length > limit) {
      const pagesAmount = surveys.length / limit;
      setPages(Math.ceil(pagesAmount));
    } else {
      setPages(0);
    }
  }, [surveys]);

  const paginationItems = () => {
    const paginationItems = [];
    for (let i=1; i <= pages; i++) {
      let active = false;
      if (currentPage === i) active = true;
      paginationItems.push(<Pagination.Item active={active} key={i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    };
    return paginationItems;
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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search for surveys..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="ml-2 px-md-5" 
                  disabled={valid ? false : true}
                >
                  Search
                </Button>
              </Form.Group>
            </Form>
            {surveys.length > 0 ? (
              <SurveysList surveys={surveys} loading={loading} />
            ) : (
              <div className="mt-5 mb-2">
                <h4 className="text-center">No surveys found.</h4>
                <Image src={NotFoundImage} height="180" className="d-block mx-auto mt-4" />
              </div>
            )}
            {pages > 0 && (
              <Pagination className="mt-4">
                {paginationItems()}
              </Pagination>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
