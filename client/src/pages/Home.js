import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
// Components
import SurveysList from "../components/SurveysList";

function Home() {
  const [popularSurveys, setPopularSurveys] = useState([]);
  const [latestSurveys, setLatestSurveys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("api/surveys/get?sort=createdAt&limit=5").then((res) => {
      setLatestSurveys(res.data);
      setLoading(false);
    });
    axios.get("api/surveys/get?sort=votesCount&limit=5").then((res) => {
      setPopularSurveys(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Card border="dark">
      <Card.Header className="text-center">
        <h4 className="my-2">
          Welcome on mySurveys<span className="green-text">.com</span>
        </h4>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h3 className="text-center mb-4">Latest Surveys</h3>
            <SurveysList surveys={latestSurveys} loading={loading} />
          </Col>
          <Col md={6}>
            <h3 className="text-center mb-4">Popular Surveys</h3>
            <SurveysList surveys={popularSurveys} loading={loading} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default Home;
