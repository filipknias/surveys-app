import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
// Components
import SurveysList from "../components/surveys/SurveysList";
import Error from "../components/Error";
// Images
import NotFoundImage from "../components/img/not-found-image.svg";

function Home() {
  const [popularSurveys, setPopularSurveys] = useState([]);
  const [latestSurveys, setLatestSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get surveys
  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    setLoading(true);
    // Get latest surveys
    axios
      .get("api/surveys/get?sort=createdAt&limit=5&status=public", {
        cancelToken: cancelTokenSource.token,
      })
      .then((res) => {
        setLatestSurveys(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err.response.data.error);
        setLoading(false);
      });

    // Get popular surveys
    axios
      .get("api/surveys/get?sort=votesCount&limit=5&status=public", {
        cancelToken: cancelTokenSource.token,
      })
      .then((res) => {
        setPopularSurveys(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err.response.data.error);
        setLoading(false);
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  // No surveys found image
  const noSurveysFound = (
    <div className="my-5">
      <Image
        src={NotFoundImage}
        height="100"
        className="d-block mx-auto mt-4"
      />
      <h4 className="text-center">No surveys found.</h4>
    </div>
  );

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <Card border="dark">
          <Card.Header className="text-center" as="h5">
            Welcome on mySurveys<span className="green-text">.com</span>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4 className="text-center mb-4">Latest Surveys</h4>
                {loading ? (
                  <Spinner animation="border" className="m-auto d-block" />
                ) : (
                  <>
                    {latestSurveys.length > 0 ? (
                      <SurveysList surveys={latestSurveys} />
                    ) : (
                      <>{noSurveysFound}</>
                    )}
                  </>
                )}
              </Col>
              <Col md={6}>
                <h4 className="text-center mb-4">Popular Surveys</h4>
                {loading ? (
                  <Spinner animation="border" className="m-auto d-block" />
                ) : (
                  <>
                    {popularSurveys.length > 0 ? (
                      <SurveysList surveys={popularSurveys} />
                    ) : (
                      <>{noSurveysFound}</>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default Home;
