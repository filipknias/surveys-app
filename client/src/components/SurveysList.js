import React from "react";
import { Link } from "react-router-dom";
// Bootstrap
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
// Images
import PieChart from "./img/pie-chart.svg";

function SurveysList({ surveys, loading }) {
  return (
    <>
      {loading && <Spinner animation="border" className="m-auto d-block" />}
      <ListGroup>
        {surveys.map((survey) => (
          <Link to={`/surveys/${survey._id}/vote`} key={survey._id}>
            <ListGroup.Item className="d-flex">
              <Image height="50" src={PieChart} />
              <div className="ml-4">
                <h4>{survey.title}</h4>
                <p className="text-muted mb-0">Votes: {survey.votesCount}</p>
                <p className="text-muted mb-0">
                  {new Date(survey.createdAt)
                    .toDateString()
                    .substr(3, survey.createdAt.length)}
                </p>
              </div>
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </>
  );
}

export default SurveysList;
