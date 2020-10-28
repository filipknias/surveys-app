import React, { useState } from "react";
import axios from "axios";
// Components
import SurveysList from "../components/surveys/SurveysList";
import Error from "../components/Error";
import SearchBar from "../components/surveys/SearchBar";
import PaginationTabs from "../components/PaginationTabs";
// Bootstrap
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
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
    limitValue,
    cancelTokenSource
  ) => {
    // Start loading
    setLoading(true);
    axios
      .get(
        `/api/surveys/get?sort=${sortValue}&title=${titleValue.trim()}&page=${currentPageValue}&limit=${limitValue}&status=public`,
        { cancelToken: cancelTokenSource.token }
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
        if (axios.isCancel(err)) return;
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
                  <>
                    <SurveysList surveys={response.results} />
                    <div className="mt-5">
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
          </Card.Body>
        </Card>
      )}
    </>
  );
}
